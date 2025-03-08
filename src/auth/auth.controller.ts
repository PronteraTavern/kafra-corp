import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/public.decorator';
import { LoginResponse } from './dtos/login-response.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ValidatedUserDto } from 'src/users/dtos/validated-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Request() req: AuthenticatedRequest): LoginResponse {
    return this.authService.signIn(req.user.id);
  }

  @Public()
  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ValidatedUserDto> {
    return await this.userService.create(createUserDto);
  }
}
