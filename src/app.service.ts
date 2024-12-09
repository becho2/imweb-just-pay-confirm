import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetSiteInfoRequestDto } from './dto/get-site-info-request.dto';

@Injectable()
export class AppService {
  prisma = new PrismaClient();
  constructor() {}

  async getSiteInfo(query: GetSiteInfoRequestDto): Promise<string> {
    const site = await this.prisma.site.findUnique({
      where: {
        site_code: query.siteCode,
        is_deleted: 'N',
      },
    });

    if (!site) {
      await this.prisma.site.create({
        data: {
          site_code: query.siteCode,
        },
      });
    }

    return 'Hello World!';
  }
}
