import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { MachinesService } from "./machines.service";
import { Machine } from "./schemes/machine.schema";
import { MachineCreateDto } from "./dto/machine-create.dto";

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesSerivce: MachinesService) {}

  @Get()
  getAll(): Promise<any> {
    return this.machinesSerivce.getMachines();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<any> {
    return this.machinesSerivce.getMachineById(id);
  }

  @Post()
  createMachine(@Body() newMachine: MachineCreateDto): Promise<Machine> {
    return this.machinesSerivce.createMachine(newMachine);
  }

  @Put(':id')
  updateMachine(@Param('id') id: number, @Body() updateMachine: MachineCreateDto): Promise<Machine> {
    return this.machinesSerivce.updateMachine(id, updateMachine);
  }

  @Delete(':id')
  deleteMachine(@Param('id') id: number): Promise<string> {
    return this.machinesSerivce.deleteMachine(id);
  }
}
