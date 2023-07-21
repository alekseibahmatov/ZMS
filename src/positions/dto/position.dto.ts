import { ApiProperty } from "@nestjs/swagger";

export class PositionDto {
  @ApiProperty()
  readonly top: number;
  @ApiProperty()
  readonly left: number;
}