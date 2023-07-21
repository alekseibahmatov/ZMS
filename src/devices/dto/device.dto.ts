import { deviceTypes } from '../schemas/devices.schema';
import { ApiProperty } from "@nestjs/swagger";

export class DeviceDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly ip: string;
  @ApiProperty()
  readonly type: deviceTypes;
}