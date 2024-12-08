import { Test, TestingModule } from '@nestjs/testing';
import { ImwebApiService } from './imweb-api.service';

describe('ImwebApiService', () => {
  let service: ImwebApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImwebApiService],
    }).compile();

    service = module.get<ImwebApiService>(ImwebApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
