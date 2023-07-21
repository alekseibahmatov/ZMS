import { Module } from '@nestjs/common';
import { FactoryplansService } from './factoryplans.service';
import { FactoryplansController } from './factoryplans.controller';

@Module({
  providers: [FactoryplansService],
  controllers: [FactoryplansController]
})
export class FactoryplansModule {}
