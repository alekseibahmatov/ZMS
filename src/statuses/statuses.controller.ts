import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StatusesService } from "./statuses.service";
import { Status } from "./schemes/statuses.schema";
import { StatusDto } from "./dto/status.dto";

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  getAllStatuses(): Promise<Status[]> {
    return this.statusesService.findAll();
  }

  @Get(':id')
  getStatusById(@Param('id') id: number): Promise<Status> {
    return this.statusesService.findById(id);
  }

  @Post()
  createStatus(@Body() statusDto: StatusDto): Promise<Status> {
    return this.statusesService.create(statusDto);
  }

  @Put(':id')
  updateStatus(@Param('id') id: number, @Body() statusDto: StatusDto):Promise<Status> {
    return this.statusesService.update(id, statusDto);
  }

  @Delete(':id')
  removeStatus(@Param('id') id: number): Promise<string> {
    return this.statusesService.remove(id);
  }
}
