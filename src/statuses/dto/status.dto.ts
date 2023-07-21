import { ApiProperty } from "@nestjs/swagger";

export class StatusDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly colorCode: string;
  @ApiProperty()
  readonly pool: string;
}