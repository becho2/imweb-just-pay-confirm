import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImwebApiModule } from './imweb-api/imweb-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImwebApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
