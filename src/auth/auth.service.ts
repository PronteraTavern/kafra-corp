import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignInResponseDto } from './dtos/signin-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { SignUpResponseDto } from './dtos/signup-response.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { GoogleUserDto } from './dtos/create-google-user.dto';
import { refreshJwtConfig } from '../config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  async signIn(id: string): Promise<SignInResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException();
    }
    const payload: JwtPayload = { id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(
        payload,
        this.refreshTokenConfig,
      ),
      user_info: user,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<SignUpResponseDto> {
    // TODO first, verify if email already exist
    const user = await this.usersService.create(createUserDto);

    const payload: JwtPayload = { id: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.refreshTokenConfig,
    );

    return { access_token, refresh_token: refreshToken, user_info: user };
  }

  async validateGoogleUser(googleUser: GoogleUserDto): Promise<User> {
    const user = await this.usersService.findByEmail(googleUser.email);

    // Returns user if it's already registered in the database
    if (user) {
      return user;
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

  async refreshToken(id: string): Promise<RefreshTokenDto> {
    const payload: JwtPayload = { id };
    const token = await this.jwtService.signAsync(payload);
    return {
      id,
      access_token: token,
    };
  }
}
