import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetAuthorizationCodeRequestDto } from './dto/get-authorization-code-request.dto';
import { GetSiteInfoRequestDto } from './dto/get-site-info-request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSiteInfo(@Query() query: GetSiteInfoRequestDto): Promise<string> {
    return this.appService.getSiteInfo(query);
  }

  @Get('authorize-callback')
  async getAuthorizationCode(
    @Query() query: GetAuthorizationCodeRequestDto,
  ): Promise<string> {
    return this.appService.getAuthorizationCode(query);
  }

  @Get('confirm-all')
  async confirmAll(): Promise<string> {
    await this.appService.confirmAll();

    return '모든 결제대기 상태인 무통장입금 주문을 수동입금확인 처리했습니다.';
  }
}
