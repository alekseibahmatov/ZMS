import { Body, Controller, Param, Put } from "@nestjs/common";
import { PositionsService } from "./positions.service";
import { PositionDto } from "./dto/position.dto";
import { Device } from "../devices/schemas/devices.schema";

@Controller('positions')
export class PositionsController {

  constructor(private readonly positionsService: PositionsService) {}

  @Put(':id')
  updatePosition(@Param('id') deviceId: number, @Body() position: PositionDto): Promise<Device> {
    return this.positionsService.update(deviceId, position);
  }
}
