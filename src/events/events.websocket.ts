import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';
import { EventBeginDto } from './dto/event-begin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event, State } from './schemas/event.schema';
import { Not, Repository } from 'typeorm';
import { EventBroadcastDto } from './dto/event-broadcast.dto';
import { Status } from '../statuses/schemes/statuses.schema';
import { Machine } from '../machines/schemes/machine.schema';
import { Device } from '../devices/schemas/devices.schema';

@WebSocketGateway({ cors: true })
export class EventsWebsocketGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly eventService: EventsService,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(Status) private statusRepository: Repository<Status>,
    @InjectRepository(Machine) private machineRepository: Repository<Machine>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}

  afterInit(server: Server) {
    this.eventService.setSocketServer(server);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const statuses = await this.statusRepository.find();

    let events = [];

    for (const status of statuses) {
      const currentEvents = await this.eventRepository.find({
        where: {
          state: Not(State.DONE),
          status: {
            id: status.id,
          },
        },
      });

      let broadcastEvents: EventBroadcastDto[] = [];

      for (const event of currentEvents) {
        const device = await this.deviceRepository.findOne({
          where: {
            id: event.device.id,
          },
          relations: ['machine'],
        });

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
    client.emit('events', events);

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
        state: State.PROCESSING
      }

      return {
        ...machine,
        additionalData
      };
    });

    const newMachines = await Promise.all(newMachinesPromises);

    client.emit('machines', newMachines);
  }

  @SubscribeMessage('beginEvent')
  async beginEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() event: EventBeginDto,
  ) {
    const foundEvent = await this.eventRepository.findOne({
      where: {
        id: event.eventId,
        state: State.WAITING_FOR_ACCEPTANCE,
      },
    });

    if (!foundEvent)
      return client.emit('beginEvent', { message: 'Event not found' });

    foundEvent.state = State.PROCESSING;

    await this.eventRepository.save(foundEvent);

    client.emit('beginEvent', { message: 'Event was started' });

    await this.broadcastEvents();

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
        state: State.PROCESSING
      }

      return {
        ...machine,
        additionalData
      };
    });

    const newMachines = await Promise.all(newMachinesPromises);

    this.server.emit('machines', newMachines);
  }

  @SubscribeMessage('endEvent')
  async endEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() event: EventBeginDto,
  ) {
    const foundEvent = await this.eventRepository.findOne({
      where: {
        id: event.eventId,
        state: State.PROCESSING,
      },
    });

    if (!foundEvent)
      return client.emit('endEvent', { message: 'Event not found' });

    foundEvent.state = State.DONE;

    await this.eventRepository.save(foundEvent);

    client.emit('endEvent', { message: 'Event was ended' });

    await this.broadcastEvents();

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
        state: State.PROCESSING
      }

      return {
        ...machine,
        additionalData
      };
    });

    const newMachines = await Promise.all(newMachinesPromises);

    this.server.emit('machines', newMachines);
  }

  async broadcastEvents() {
    const statuses = await this.statusRepository.find();

    let events = [];

    for (const status of statuses) {
      const currentEvents = await this.eventRepository.find({
        where: {
          state: Not(State.DONE),
          status: {
            id: status.id,
          },
        },
      });

      let broadcastEvents: EventBroadcastDto[] = [];

      for (const event of currentEvents) {
        const device = await this.deviceRepository.findOne({
          where: {
            id: event.device.id,
          },
          relations: ['machine'],
        });

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
    this.server.emit('events', events);
  }
}