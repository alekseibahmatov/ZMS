import { Test, TestingModule } from '@nestjs/testing';
import { FactoryplansService } from './factoryplans.service';

describe('FactoryplansService', () => {
  let service: FactoryplansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactoryplansService],
    }).compile();

    service = module.get<FactoryplansService>(FactoryplansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
