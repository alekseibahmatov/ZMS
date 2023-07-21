import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './schemas/devices.schema';
import { DeleteResult, Repository } from "typeorm";
import { DeviceDto } from './dto/device.dto';
import { Position } from '../positions/schemas/positions.schema';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async create(createDeviceDto: DeviceDto): Promise<Device> {
    const { name, ip, type } = createDeviceDto;

    const positionEntity = new Position();
    positionEntity.top = 0;
    positionEntity.left = 0;

    const createdPosition = await this.positionRepository.save(positionEntity);

    const device = new Device();
    device.name = name;
    device.ip = ip;
    device.type = type;
    device.position = createdPosition;

    return await this.deviceRepository.save(device);
  }

  async update(id: number, updateDeviceDto: DeviceDto): Promise<Device> {
    const { name, ip, type } = updateDeviceDto;

    const device = await this.deviceRepository.findOne({
      where: {
        id: id
      }
    });

    if (!device) throw new NotFoundException('Device not found!');

    device.name = name;
    device.ip = ip;
    device.type = type;

    return await this.deviceRepository.save(device);
  }

  async remove(id: number): Promise<string> {
    const deletedDevice = await this.deviceRepository.delete(id);

    if (deletedDevice.affected > 0) return 'Device was deleted!';
    return 'Device not found';
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }
}
