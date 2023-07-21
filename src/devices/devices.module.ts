import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { PositionsController } from '../positions/positions.controller';
import { PositionsService } from '../positions/positions.service';
import { StatusesController } from '../statuses/statuses.controller';
import { InputsController } from '../inputs/inputs.controller';
import { StatusesService } from '../statuses/statuses.service';
import { InputsService } from '../inputs/inputs.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./schemas/devices.schema";
import { Input } from "../inputs/schemas/inputs.schema";
import { Position } from "../positions/schemas/positions.schema";
import { Status } from "../statuses/schemes/statuses.schema";
import { Event } from "../events/schemas/event.schema";
import { EventsService } from "../events/events.service";
import { EventsWebsocketGateway } from "../events/events.websocket";
import { Machine } from "../machines/schemes/machine.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Device,
      Input,
      Position,
      Status,
      Event,
      Machine
    ])
  ],
  controllers: [
    DevicesController,
    PositionsController,
    StatusesController,
    InputsController,
  ],
  providers: [
    DevicesService,
    PositionsService,
    StatusesService,
    InputsService,
    EventsService,
    EventsWebsocketGateway
  ],
})
export class DevicesModule {}
