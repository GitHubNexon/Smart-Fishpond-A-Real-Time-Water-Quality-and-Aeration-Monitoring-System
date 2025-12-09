import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from './rbac.service';

describe('RbacService', () => {
  let service: RbacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RbacService],
    }).compile();

    service = module.get<RbacService>(RbacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
