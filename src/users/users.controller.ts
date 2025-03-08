import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ValidatedUserDto } from './dtos/validated-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from 'src/public.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ValidatedUserDto> {
    return await this.userService.profile(req.user.id);
  }

  @Public()
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ValidatedUserDto> {
    return await this.userService.create(createUserDto);
  }

  @Delete()
  async removeUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<ValidatedUserDto> {
    return await this.userService.remove(req.user.id);
  }
}
