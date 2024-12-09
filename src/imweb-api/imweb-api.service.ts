import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AccessTokenResponseData,
  AccessTokenResponseDto,
} from './dto/response/get-access-token-response.dto';
import { OrdersResponseDto } from './dto/response/orders-response.dto';

// API의 응답 JSON을 그대로 갖다 붙여서 Interface 를 만드세요.
// https://app.quicktype.io/ 에서 자동으로 만들어줍니다.

@Injectable()
export class ImwebApiService {
  private readonly baseUrl = 'https://openapi.imweb.me';
  constructor(private readonly httpService: HttpService) {}

  async getAuthorizationCode(siteCode: string) {
    await firstValueFrom(
      this.httpService
        .get(`${this.baseUrl}/oauth2/authorize`, {
          params: {
            responseType: 'code',
            clientId: process.env.IMWEB_APP_CLIENT_ID,
            redirectUri:
              'https://justpayconfirm.duckdns.org/authorize-callback',
            siteCode,
            scope: 'site-info:write order:write payment:write',
            state: siteCode,
          },
        })
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw new Error('getAuthorizationCode: An error happened!');
          }),
        ),
    );
  }

  async getAccessToken(code: string): Promise<AccessTokenResponseData> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<AccessTokenResponseDto>(
          `${this.baseUrl}/oauth2/token`,
          {
            grantType: 'authorization_code',
            code,
            clientId: process.env.IMWEB_APP_CLIENT_ID,
            clientSecret: process.env.IMWEB_APP_CLIENT_SECRET,
            redirectUri:
              'https://justpayconfirm.duckdns.org/authorize-callback',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw new Error('getAccessToken: An error happened!');
          }),
        ),
    );

    return data.data;
  }

  async getPayWaitOrders(accessToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<OrdersResponseDto>(
          `${this.baseUrl}/orders?page=1&saleChannel=IMWEB&limit=10&orderSectionStatus=PRODUCT_PREPARATION`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw new Error('getPayWaitOrders: An error happened!');
          }),
        ),
    );

    return data.data.list;
  }

  async confirmPayWaitOrder(accessToken: string, orderNo: number) {
    await firstValueFrom(
      this.httpService
        .post(
          `${this.baseUrl}/payments/${orderNo}/bank-transfer/confirm`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw new Error('confirmPayWaitOrder: An error happened!');
          }),
        ),
    );
  }
}
