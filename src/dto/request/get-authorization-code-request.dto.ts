import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class GetAuthorizationCodeRequestDto {
  @IsString()
  @Expose()
  code: string;

  @IsString()
  @Expose()
  state: string;

  @IsString()
  @IsOptional()
  @Expose()
  error?: string;
}
