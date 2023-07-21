import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './schemas/positions.schema';
import { Repository } from 'typeorm';
import { Device } from '../devices/schemas/devices.schema';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}

  async update(deviceId: number, position: PositionDto): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
      relations: ['position'], // Include the "position" relationship
    });

    if (!device) {
      throw new NotFoundException('Device not found!');
    }

    // Update the position properties
    device.position.top = position.top;
    device.position.left = position.left;

    // Save the updated device entity
    return await this.deviceRepository.save(device);
  }
}
