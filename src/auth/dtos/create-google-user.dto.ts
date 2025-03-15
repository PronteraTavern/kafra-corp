import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class GoogleUserDto {
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
}
