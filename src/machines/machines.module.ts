import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Machine } from "./schemes/machine.schema";
import { DevicesModule } from "../devices/devices.module";
import { Device } from "../devices/schemas/devices.schema";
import { MachinesService } from "./machines.service";
import { MachinesController } from "./machines.controller";
import { Event } from "../events/schemas/event.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Machine,
      Device,
      Event
    ]),
    DevicesModule
  ],
  providers:[
    MachinesService
  ],
  controllers: [MachinesController]
})
export class MachinesModule {}
