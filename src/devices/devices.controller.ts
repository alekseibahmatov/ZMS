import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DevicesService } from "./devices.service";
import { Device } from "./schemas/devices.schema";
import { DeviceDto } from "./dto/device.dto";
import { DeleteResult } from "typeorm";

@Controller('devices')
export class DevicesController {

  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  getDevices(): Promise<Device[]> {
    return this.devicesService.findAll();
  }

  @Post()
  createDevice(@Body() deviceDto: DeviceDto): Promise<Device> {
    return this.devicesService.create(deviceDto);
  }

  @Delete(':id')
  deleteDevice(@Param('id') id: number): Promise<string> {
    return this.devicesService.remove(id);
  }

  @Put(':id')
  updateDevice(@Param('id') id: number, @Body() deviceDto: DeviceDto): Promise<Device> {
    return this.devicesService.update(id, deviceDto);
  }
}
