import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../devices/schemas/devices.schema';
import { Not, Repository } from 'typeorm';
import axios from 'axios';
import { Event, State } from './schemas/event.schema';
import { Status } from '../statuses/schemes/statuses.schema';
import { EventBroadcastDto } from './dto/event-broadcast.dto';
import { Machine } from "../machines/schemes/machine.schema";

@Injectable()
export class EventsService {
  private socketServer: Server;

  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Status) private statusRepository: Repository<Status>,
    @InjectRepository(Machine) private machineRepository: Repository<Machine>
  ) {}

  setSocketServer(socketServer: Server) {
    this.socketServer = socketServer;
  }

  @Timeout(100)
  async getDevicesInfo() {
    const devices = await this.deviceRepository.find();

    for (const device of devices) {
      await this.getDeviceInfo(device, 100);
    }
  }

  async getDeviceInfo(device: Device, delay: number) {
    setTimeout(async () => {
      try {
        const response = await axios.get(
          `http://${device.ip}/api/slot/0/io/di`,
          {
            headers: {
              Accept: 'vdn.dac.v1',
              'Content-Type': 'application/json',
            },
          },
        );

        const inputs = response.data.io.di;

        const dbInputs = device.inputs.map((input) => {
          return {
            inputId: input.inputId,
            status: input.status,
          };
        });

        let wasNewEvent: boolean = false;

        for (const input of inputs) {
          if (
            dbInputs.filter((i) => i.inputId === input.diIndex).length === 1
          ) {
            if (input.diStatus === 0) continue;

            const existingEvent = await this.eventRepository.count({
              where: {
                device: {
                  id: device.id
                },
                state: Not(State.DONE),
              },
            });

            if (existingEvent) continue;

            const newEvent = new Event();

            newEvent.device = device;
            newEvent.status = dbInputs.filter(
              (i) => i.inputId === input.diIndex,
            )[0].status;
            newEvent.state = State.WAITING_FOR_ACCEPTANCE;

            await this.eventRepository.save(newEvent);
            wasNewEvent = true;
          }
        }

        if (wasNewEvent) {
          const statuses = await this.statusRepository.find();

          let events = [];

          for (const status of statuses) {
            const currentEvents = await this.eventRepository.find({
              where: {
                state: Not(State.DONE),
                status: {
                  id: status.id
                },
              },
            });

            let broadcastEvents: EventBroadcastDto[] = [];

            for (const event of currentEvents) {
              const device = await this.deviceRepository.findOne({
                where: {
                  id: event.device.id
                },
                relations: ["machine"]
              })

              if (device.machine === null) continue;

              let broadcastEvent = new EventBroadcastDto();
              broadcastEvent.eventId = event.id;
              broadcastEvent.state = event.state;
              broadcastEvent.status = event.status.name;

              broadcastEvent.machineName = device.machine.name;

              broadcastEvents.push(broadcastEvent);
            }

            events.push({
              pool: status.pool,
              events: broadcastEvents,
            });
          }
          this.socketServer.emit('events', events);

          const machines = await this.machineRepository.find();

          const newMachinesPromises = machines.map(async machine => {
            const event = await this.eventRepository.findOne({
              where: {
                device: {
                  id: machine.device.id
                },
                state: Not(State.DONE),
              },
              order: {
                createdAt: 'DESC'
              }
            });

            if (event) {
              const additionalData = {
                status: event.status.name,
                colorCode: event.status.colorCode,
                state: event.state
              }

              return {
                ...machine,
                additionalData
              };
            }

            const additionalData = {
              status: 'IDLE',
              colorCode: '#72ff7d',
              state: State.PROCESSING
            }

            return {
              ...machine,
              additionalData
            };
          });

          const newMachines = await Promise.all(newMachinesPromises);

          this.socketServer.emit('machines', newMachines);
        }

        await this.getDeviceInfo(device, 100);
      } catch (e) {
        console.log(e)
        console.log(`Device with ip: ${device.ip} is currently offline`);
        await this.getDeviceInfo(device, 30000);
      }
    }, delay);
  }
}
