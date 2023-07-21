import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FactoryplansService } from './factoryplans.service';
import { Response } from 'express';

@Controller('factoryplans')
export class FactoryplansController {
  constructor(private readonly factoryplanService: FactoryplansService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<string> {
    return await this.factoryplanService.saveFile(file);
  }

  @Get()
  async getFile(@Res() res: Response) {
    const file = await this.factoryplanService.getFile();
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file);
  }
}
