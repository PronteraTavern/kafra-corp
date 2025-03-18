import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../utils/pagination.dto';
import { SafeUserDto } from '../users/dtos/safe-user.dto';

@Injectable()
export class AdminService {
  constructor(private userService: UsersService) {}

  async listUsers(paginationDto: PaginationDto): Promise<SafeUserDto[]> {
    return this.userService.find(paginationDto);
  }
}
