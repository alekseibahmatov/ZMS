import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './schemes/statuses.schema';
import { Repository } from 'typeorm';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status) private statusRepository: Repository<Status>,
  ) {}

  async findAll(): Promise<Status[]> {
    return await this.statusRepository.find();
  }

  async findById(id: number): Promise<Status> {
    return this.statusRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(status: StatusDto): Promise<Status> {
    const createdStatus = await this.statusRepository.create(status);
    return await this.statusRepository.save(createdStatus);
  }

  async update(id: number, status: StatusDto) {
    const statusEntry = await this.statusRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!statusEntry) throw new NotFoundException('Status not found');

    statusEntry.name = status.name;
    statusEntry.colorCode = status.colorCode;
    statusEntry.pool = status.pool;

    return await this.statusRepository.save(statusEntry);
  }

  async remove(id: number): Promise<string> {
    const removedStatus = await this.statusRepository.delete(id);

    if (removedStatus.affected > 0) return 'Status was deleted!';
    throw new NotFoundException('Status not found');
  }
}
