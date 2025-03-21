import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SafeUserDto } from './dtos/safe-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Use profile has been sucessfully found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async profile(@Param('id') id: string): Promise<SafeUserDto> {
    return await this.userService.profile(id);
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
  async delete(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    if (req.user.id === id) {
      return await this.userService.remove(id);
    }
    throw new UnauthorizedException();
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
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    if (req.user.id === id) {
      return await this.userService.update(id, updateUserDto);
    }
    throw new UnauthorizedException();
  }
}
