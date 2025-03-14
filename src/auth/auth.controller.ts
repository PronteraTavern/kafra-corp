import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInRequestDto } from './dtos/signin-request.dto';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpResponseDto } from './dtos/signup-response.dto';
import { Public } from '../public.decorator';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiResponse({
    status: 200,
    description: 'Successful signin',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Something wrong happened',
  })
  async signIn(
    @Request() req: AuthenticatedRequest,
    @Body() _signInRequest: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return await this.authService.signIn(req.user.id);
  }

  @Public()
  @Post('signup')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignUpResponseDto> {
    return await this.authService.signUp(createUserDto);
  }
}
