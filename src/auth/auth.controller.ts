import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/public.decorator';
import { LoginResponse } from './dtos/login-response.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: AuthenticatedRequest): LoginResponse {
    return this.authService.login(req.user.id);
  }
}
