import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { OrdersResponseDto } from './dto/response/orders-response.dto';

// API의 응답 JSON을 그대로 갖다 붙여서 Interface 를 만드세요.
// https://app.quicktype.io/ 에서 자동으로 만들어줍니다.

@Injectable()
export class ImwebApiService {
  constructor(private readonly httpService: HttpService) {}

  async getPayWaitOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<OrdersResponseDto>(
          `https://openapi.imweb.me/orders?page=1&saleChannel=IMWEB&limit=10&orderSectionStatus=PRODUCT_PREPARATION`,
          {
            headers: {
              Authorization: `Bearer ${process.env.IMWEB_API_KEY}`,
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            throw new Error('An error happened!');
          }),
        ),
    );

    return data.data.list;
  }
}
