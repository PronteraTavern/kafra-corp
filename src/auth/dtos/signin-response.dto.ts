import { IsString, IsNotEmpty } from 'class-validator';

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
