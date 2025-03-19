import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../utils/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SafeUserDto } from '../users/dtos/safe-user.dto';

@Injectable()
export class AdminService {
  constructor(private userService: UsersService) {}

  async listUsers(
    paginationDto: PaginationDto,
    route: string,
  ): Promise<Pagination<SafeUserDto>> {
    return this.userService.find({
      page: paginationDto.page,
      limit: paginationDto.limit,
      route,
    });
  }
}
