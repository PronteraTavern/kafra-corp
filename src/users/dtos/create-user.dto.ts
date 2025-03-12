import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
