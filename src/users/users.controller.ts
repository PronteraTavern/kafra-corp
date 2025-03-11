import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { SafeUserDto } from './dtos/safe-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  async profile(@Param('id') id: string): Promise<SafeUserDto> {
    return await this.userService.profile(id);
  }

  @Delete()
  async remove(@Request() req: AuthenticatedRequest): Promise<SafeUserDto> {
    return await this.userService.remove(req.user.id);
  }

  @Put()
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return await this.userService.update(req.user.id, updateUserDto);
  }
}
