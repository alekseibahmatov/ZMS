import { ApiProperty } from "@nestjs/swagger";

export class InputUpdateDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  readonly inputId: number;
  @ApiProperty()
  readonly statusId: number;
}