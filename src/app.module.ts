import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImwebApiModule } from './imweb-api/imweb-api.module';

@Module({
  imports: [ImwebApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
