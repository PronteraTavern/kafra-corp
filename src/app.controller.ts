import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './public.decorator';
import { LoginResponse } from './auth/dtos/login-response.dto';
import { ValidatedUserDto } from './users/dtos/validated-user.dto';
import { UsersService } from './users/users.service';
import { AuthenticatedRequest } from './auth/interfaces/authenticated-request.interface';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req: AuthenticatedRequest): LoginResponse {
    return this.authService.login(req.user.id);
  }

  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ValidatedUserDto | null> {
    return await this.userService.profile(req.user.id);
  }
}
