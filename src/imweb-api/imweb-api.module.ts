import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ImwebApiService } from './imweb-api.service';

@Module({
  imports: [HttpModule],
  providers: [ImwebApiService],
})
export class ImwebApiModule {}
