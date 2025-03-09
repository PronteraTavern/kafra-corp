import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/public.decorator';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInRequestDto } from './dtos/signin-request.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(
    @Request() req: AuthenticatedRequest,
    @Body() _signInRequest: SignInRequestDto,
  ): SignInResponseDto {
    return this.authService.signIn(req.user.id);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<SafeUserDto> {
    return await this.userService.create(createUserDto);
  }
}
