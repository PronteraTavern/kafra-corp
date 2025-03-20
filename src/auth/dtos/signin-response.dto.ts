import { IsString, IsNotEmpty } from 'class-validator';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  user_info: SafeUserDto;
}
