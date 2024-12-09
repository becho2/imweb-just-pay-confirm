import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetSiteInfoRequestDto } from './dto/get-site-info-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSiteInfo(@Query() query: GetSiteInfoRequestDto): Promise<string> {
    return this.appService.getSiteInfo(query);
  }
}
