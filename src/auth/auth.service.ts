import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInResponseDto } from './dtos/signin-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { SignUpResponseDto } from './dtos/signup-response.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { SafeUserDto } from '../users/dtos/safe-user.dto';
import { UsersService } from '../users/users.service';
import { GoogleUserDto } from './dtos/create-google-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUserDto> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }

  async signIn(id: string): Promise<SignInResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException();
    }
    const payload: JwtPayload = { id: user.id, role: user.role };
    const { password_hash, ...userResult } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user_info: userResult,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<SignUpResponseDto> {
    const user = await this.usersService.create(createUserDto);

    const payload: JwtPayload = { id: user.id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, user_info: user };
  }

  async validateGoogleUser(googleUser: GoogleUserDto): Promise<SafeUserDto> {
    const user = await this.usersService.findByEmail(googleUser.email);

    // Returns user if it's already registered in the database
    if (user) {
      const { password_hash, ...userResult } = user;
      return userResult;
    }

    // Creates a new use if it's not on the database yet
    const newUser = await this.usersService.create({
      avatar: googleUser.avatar,
      first_name: googleUser.first_name,
      last_name: googleUser.last_name,
      email: googleUser.email,
      password: '',
    });

    return newUser;
  }
}
