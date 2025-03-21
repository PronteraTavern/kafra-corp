import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
