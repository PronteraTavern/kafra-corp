import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '../utils/pagination.dto';
import { AdminService } from './admin.service';
import { ApiResponse } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from '../public.decorator';
import { SafeUserDto } from '../users/dtos/safe-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Get('list/users')
  @ApiResponse({
    status: 200,
    description: 'User list',
  })
  async listUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<Pagination<SafeUserDto>> {
    return this.adminService.listUsers(paginationDto, '/admin');
  }
}
