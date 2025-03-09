import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

// I'm calling it SafeUserDto because this doesn't contain the password field.
export class SafeUserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDate()
  created_at: Date;
}
