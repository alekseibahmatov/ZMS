import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { InputCreationDto } from "./dto/input-creation.dto";
import { InputsService } from "./inputs.service";
import { Input } from "./schemas/inputs.schema";
import { InputUpdateDto } from "./dto/input-update.dto";
import { DeleteResult } from "typeorm";

@Controller('inputs')
export class InputsController {

  constructor(private readonly inputsService: InputsService) {}
  @Post(':id')
  createInputs(@Param('id') id: number, @Body() inputs: InputCreationDto[]): Promise<Input[]> {
    return this.inputsService.create(id, inputs);
  }

  @Put()
  updateInputs(@Body() inputs: InputUpdateDto[]): Promise<string> {
    return this.inputsService.update(inputs);
  }

  @Delete()
  removeInputs(@Body() inputIds: number[]): Promise<DeleteResult> {
    return this.inputsService.remove(inputIds);
  }
}
