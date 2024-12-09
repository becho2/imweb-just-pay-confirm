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

    await this.imwebApiService.getAuthorizationCode(siteCode);

    return '연동이 완료되었습니다.';
  }

  async getAuthorizationCode(
    query: GetAuthorizationCodeRequestDto,
  ): Promise<string> {
    const tokenData = await this.imwebApiService.getAccessToken(query.code);

    if (tokenData) {
      console.log(tokenData);
      console.log(tokenData.accessToken);
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

  async confirmAll(): Promise<void> {
    const sites = await this.prisma.site.findMany({
      where: {
        is_deleted: 'N',
      },
    });

    for (const site of sites) {
      const token = await this.prisma.token.findFirst({
        where: {
          site_code: site.site_code,
        },
        select: {
          access_token: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (!token) {
        await this.imwebApiService.getAuthorizationCode(site.site_code);
      }

      const orders = await this.imwebApiService.getPayWaitOrders(
        token.access_token,
      );

      console.log(orders);
      // for (const order of orders) {
      //   await this.imwebApiService.confirmPayWaitOrder(
      //     token.access_token,
      //     order.order_id,
      //   );
      // }
    }
  }
}
