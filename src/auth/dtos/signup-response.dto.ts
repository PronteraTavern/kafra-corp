import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../users/user.entity';

export class SignUpResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  user_info: User;
}
