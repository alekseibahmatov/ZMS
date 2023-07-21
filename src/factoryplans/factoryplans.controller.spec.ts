import { Test, TestingModule } from '@nestjs/testing';
import { FactoryplansController } from './factoryplans.controller';

describe('FactoryplansController', () => {
  let controller: FactoryplansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactoryplansController],
    }).compile();

    controller = module.get<FactoryplansController>(FactoryplansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
