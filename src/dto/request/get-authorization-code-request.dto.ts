import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class GetAuthorizationCodeRequestDto {
  @IsString()
  @Expose()
  code: string;

  @IsString()
  @Expose()
  state: string;
}
