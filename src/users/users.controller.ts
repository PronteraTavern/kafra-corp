import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './user.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Use profile has been sucessfully found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  profile(@Request() req: AuthenticatedRequest): User {
    return req.user;
  }

  @Delete()
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Use profile has been sucessfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'User has no privileges to do that',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Request() req: AuthenticatedRequest): Promise<void> {
    return await this.userService.remove(req.user.id);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Use profile has been sucessfully updated',
  })
  @ApiResponse({
    status: 401,
    description: 'User has no privileges to do that',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(req.user, updateUserDto);
  }
}
