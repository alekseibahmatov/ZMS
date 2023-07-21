import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from './schemes/machine.schema';
import { Not, Repository } from 'typeorm';
import { Device } from '../devices/schemas/devices.schema';
import { MachineCreateDto } from './dto/machine-create.dto';
import { Event, State } from '../events/schemas/event.schema';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  async createMachine(newMachine: MachineCreateDto): Promise<Machine> {
    const device = await this.deviceRepository.findOne({
      where: {
        id: newMachine.deviceId,
      },
    });

    if (!device) throw new NotFoundException('Device not found!');

    let machine = new Machine();
    machine.name = newMachine.name;
    machine.device = device;

    return await this.machineRepository.save(machine);
  }

  async updateMachine(
    id: number,
    updateMachine: MachineCreateDto,
  ): Promise<Machine> {
    const machine = await this.machineRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!machine) throw new NotFoundException('Machine not found!');

    const device = await this.deviceRepository.findOne({
      where: {
        id: updateMachine.deviceId,
      },
    });

    if (!device) throw new NotFoundException('Device not found!');

    machine.device = device;
    machine.name = updateMachine.name;

    return await this.machineRepository.save(machine);
  }

  async deleteMachine(id: number): Promise<string> {
    const deletedMachine = await this.machineRepository.delete(id);

    if (deletedMachine.affected > 0) return 'Machine deleted successfully';
    throw new NotFoundException('Machine not found!');
  }

  async getMachineById(id: number): Promise<any> {
    const machine = await this.machineRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!machine) throw new NotFoundException('Machine not found!');

    const event = await this.eventRepository.findOne({
      where: {
        device: {
          id: machine.device.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (event) {
      const additionalData = {
        status: event.status.name,
        colorCode: event.status.colorCode,
        state: event.state,
      };

      return {
        ...machine,
        additionalData,
      };
    }
    return {
      ...machine,
      status: 'IDLE',
    };
  }

  async getMachines(): Promise<any> {
    const machines = await this.machineRepository.find();

    const newMachinesPromises = machines.map(async (machine) => {
      const event = await this.eventRepository.findOne({
        where: {
          device: {
            id: machine.device.id,
          },
          state: Not(State.DONE),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      if (event) {
        const additionalData = {
          status: event.status.name,
          colorCode: event.status.colorCode,
          state: event.state,
        };

        return {
          ...machine,
          additionalData,
        };
      }

      const additionalData = {
        status: 'IDLE',
        colorCode: '#72ff7d',
        state: State.PROCESSING,
      };

      return {
        ...machine,
        additionalData,
      };
    });

    return await Promise.all(newMachinesPromises);
  }
}
