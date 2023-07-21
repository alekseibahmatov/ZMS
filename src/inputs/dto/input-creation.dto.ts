import { ApiProperty } from "@nestjs/swagger";

export class InputCreationDto {
  @ApiProperty()
  readonly inputId: number;
  @ApiProperty()
  readonly statusId: number;
}