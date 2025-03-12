import { IsString, IsNotEmpty } from 'class-validator';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';

export class SignUpResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  user_info: SafeUserDto;
}
