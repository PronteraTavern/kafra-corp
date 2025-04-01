import { IsEmail, IsNotEmpty } from 'class-validator';
import { TripRole } from '../entities/members.entity';

export class UpdateMemberRoleDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: TripRole;
}
