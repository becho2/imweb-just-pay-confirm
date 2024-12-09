export interface AccessTokenResponseDto {
  statusCode: number;
  data: AccessTokenResponseData;
}

export interface AccessTokenResponseData {
  accessToken: string;
  refreshToken: string;
  scope: string[];
}
