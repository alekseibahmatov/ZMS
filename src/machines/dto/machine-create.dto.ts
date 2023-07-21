import { ApiProperty } from "@nestjs/swagger";

export class MachineCreateDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly deviceId: number;
}