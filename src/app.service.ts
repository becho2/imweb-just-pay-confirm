import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetAuthorizationCodeRequestDto } from './dto/request/get-authorization-code-request.dto';
import { GetSiteInfoRequestDto } from './dto/request/get-site-info-request.dto';
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
      select: {
        is_deleted: true,
      },
    });

    if (site?.is_deleted === 'N') {
      return `이미 연동이 완료된 사이트입니다. <br />
<a href="/confirm-all?siteCode=${siteCode}">모든 주문 입금확인 처리하기</a> <br />
<a href="/remove-site?siteCode=${siteCode}">이 사이트(${siteCode}) 연동 해제하기</a>
`;
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

    if (!tokenData) {
      return '토큰 발급에 실패했습니다.';
    }

    await this.prisma.token.create({
      data: {
        site_code: query.state,
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
      },
    });

    await this.imwebApiService.completeIntegration(tokenData.accessToken);

    return 'ok';
  }

  async confirmAll(siteCode?: string): Promise<string> {
    let sites = [];
    let result: string = '';

    if (siteCode) {
      const site = await this.prisma.site.findUnique({
        where: {
          site_code: siteCode,
          is_deleted: 'N',
        },
      });
      sites = site ? [site] : [];
    } else {
      sites = await this.prisma.site.findMany({
        where: {
          is_deleted: 'N',
        },
      });
    }

    for (const site of sites) {
      result += `----- siteCode: ${site.site_code} CHECK <br />`;
      const siteCode = site.site_code;

      const token = await this.prisma.token.findFirst({
        where: {
          site_code: siteCode,
        },
        select: {
          access_token: true,
          refresh_token: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (!token) {
        continue;
      }

      let accessToken = token.access_token;
      const refreshToken = token.refresh_token;
      let orders = [];

      try {
        orders =
          await this.imwebApiService.getProductPreparationOrders(accessToken);
      } catch (error) {
        if (
          error.response.data.statusCode === 401 &&
          error.response.data.error.errorCode === '30102'
        ) {
          const newToken = await this.refreshToken(siteCode, refreshToken);
          accessToken = newToken.accessToken;

          orders =
            await this.imwebApiService.getProductPreparationOrders(accessToken);
        } else {
          throw error;
        }
      }

      for (const order of orders) {
        result += `orderNo: ${order.orderNo} CHECK <br />`;

        if (
          order.payments.some(
            (payment) => payment.paymentStatus === 'PAYMENT_PREPARATION',
          )
        ) {
          result += `${order.orderNo}는 결제대기 상태인 주문입니다. 수동입금확인 처리합니다. <br /><br />`;
          await this.imwebApiService.confirmPayWaitOrder(
            accessToken,
            order.orderNo,
          );
        }
      }

      result += `----- siteCode: ${site.site_code} CHECK END<br />`;
    }

    return result;
  }

  async removeSite(siteCode?: string): Promise<void> {
    if (!siteCode) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      const token = await tx.token.findFirst({
        where: {
          site_code: siteCode,
        },
        select: {
          access_token: true,
        },
      });

      await this.imwebApiService.cancelIntegration(token.access_token);

      await tx.site.update({
        where: {
          site_code: siteCode,
        },
        data: {
          is_deleted: 'Y',
        },
      });

      await tx.token.deleteMany({
        where: {
          site_code: siteCode,
        },
      });
    });
  }

  private async refreshToken(siteCode: string, refreshToken: string) {
    const tokenData = await this.imwebApiService.refreshToken(refreshToken);

    await this.prisma.token.updateMany({
      data: {
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
      },
      where: {
        site_code: siteCode,
      },
    });

    return tokenData;
  }
}
