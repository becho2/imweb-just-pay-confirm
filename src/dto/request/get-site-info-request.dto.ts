import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@Exclude()
export class GetSiteInfoRequestDto {
  @IsString()
  @Length(22, 22)
  @Expose()
  siteCode: string;
}
