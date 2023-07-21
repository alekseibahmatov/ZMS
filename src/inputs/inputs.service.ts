import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Input } from "./schemas/inputs.schema";
import { DeleteResult, Repository } from "typeorm";
import { Device } from "../devices/schemas/devices.schema";
import { InputCreationDto } from "./dto/input-creation.dto";
import { Status } from "../statuses/schemes/statuses.schema";
import { InputUpdateDto } from "./dto/input-update.dto";

@Injectable()
export class InputsService {
  constructor(
    @InjectRepository(Input) private inputRepository: Repository<Input>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(Status) private statusRepository: Repository<Status>
    ) {}

  async create(deviceId: number, inputs: InputCreationDto[]): Promise<Input[]> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });

    if (!device) throw new NotFoundException('Device not found');

    const inputEntities: Input[] = await Promise.all(
      inputs.map(async (inputDto) => {
        const input = new Input();
        input.inputId = inputDto.inputId;

        input.status = await this.statusRepository.findOne({
          where: { id: inputDto.statusId },
        });

        input.device = device;

        return input;
      }),
    );

    return await this.inputRepository.save(inputEntities);
  }

  async update(updateInputs: InputUpdateDto[]): Promise<string> {
    for (const updatedInput of updateInputs) {
      const input = await this.inputRepository.findOne({
        where: {
          id: updatedInput.id
        }
      });

      if (!input) continue;

      input.inputId = updatedInput.inputId;

      const status = await this.statusRepository.findOne({
        where: {
          id: updatedInput.statusId
        }
      });

      if (!status) throw new NotFoundException(`Status with id: ${updatedInput.statusId} not found for input with id: ${input.id}`);

      input.status = status;

      await this.inputRepository.save(input);
    }

    return 'All inputs were updated!';
  }

  async remove(inputIds: number[]): Promise<DeleteResult> {
    return this.inputRepository.delete(inputIds);
  }
}
