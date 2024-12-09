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
      },
    });

    if (site?.is_deleted === 'N') {
      return '이미 연동이 완료된 사이트입니다.';
    }

    await this.imwebApiService.getAuthorizationCode(siteCode);

    if (site?.is_deleted === 'Y') {
      await this.prisma.site.update({
        where: {
          site_code: siteCode,
        },
        data: {
          is_deleted: 'N',
        },
      });
    }

    if (!site) {
      await this.prisma.site.create({
        data: {
          site_code: query.siteCode,
        },
      });
    }

    return '연동이 완료되었습니다.';
  }

  async getAuthorizationCode(
    query: GetAuthorizationCodeRequestDto,
  ): Promise<string> {
    const tokenData = await this.imwebApiService.getAccessToken(query.code);

    if (tokenData) {
      await this.prisma.token.create({
        data: {
          site_code: query.state,
          access_token: tokenData.accessToken,
          refresh_token: tokenData.refreshToken,
        },
      });
    }

    return 'ok';
  }
}
