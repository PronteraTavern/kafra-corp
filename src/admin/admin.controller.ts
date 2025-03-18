import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '../utils/pagination.dto';
import { AdminService } from './admin.service';
import { SafeUserDto } from '../users/dtos/safe-user.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get('list/users')
  @ApiResponse({
    status: 200,
    description: 'User list',
  })
  async listUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<SafeUserDto[]> {
    return this.adminService.listUsers(paginationDto);
  }
}
