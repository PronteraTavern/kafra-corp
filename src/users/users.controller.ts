import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { SafeUserDto } from './dtos/safe-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile')
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
    status: 404,
    description: 'User not found',
  })
  async remove(@Request() req: AuthenticatedRequest): Promise<void> {
    return await this.userService.remove(req.user.id);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Use profile has been sucessfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    return await this.userService.update(req.user.id, updateUserDto);
  }
}
