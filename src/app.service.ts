import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetAuthorizationCodeRequestDto } from './dto/get-authorization-code-request.dto';
import { GetSiteInfoRequestDto } from './dto/get-site-info-request.dto';
import { ImwebApiService } from './imweb-api/imweb-api.service';

@Injectable()
export class AppService {
  prisma = new PrismaClient();
  constructor(private readonly imwebApiService: ImwebApiService) {}

  async getSiteInfo(query: GetSiteInfoRequestDto): Promise<string> {
    const { siteCode } = query;
    const site = await this.prisma.site.findUnique({
      where: {
        site_code: siteCode,
        is_deleted: 'N',
      },
    });

    if (!site) {
      await this.prisma.site.create({
        data: {
          site_code: query.siteCode,
        },
      });

      await this.imwebApiService.getAuthorizationCode(siteCode);
    }

    return 'Hello World!';
  }

  async getAuthorizationCode(
    query: GetAuthorizationCodeRequestDto,
  ): Promise<string> {
    const tokenData = await this.imwebApiService.getAccessToken(query.code);

    if (tokenData) {
      await this.prisma.token.create({
        data: {
          site_code: query.state,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
        },
      });
    }

    return 'ok';
  }
}
