import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FactoryplansService {
  async saveFile(file): Promise<string> {

    const dirPath = join(__dirname, '..', 'uploads');
    const filePath = join(dirPath, 'factoryplan.jpg');

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  async getFile(): Promise<Buffer> {
    const filePath = join(__dirname, '..', 'uploads', 'factoryplan.jpg');
    return await fs.readFile(filePath);
  }
}
