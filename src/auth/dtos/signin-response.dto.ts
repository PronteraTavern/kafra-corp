import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../users/user.entity';

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  user_info: User;
}
