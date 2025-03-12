import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

/**
 * I'm calling it SafeUserDto because this doesn't contain the password field.
 */
export class SafeUserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
