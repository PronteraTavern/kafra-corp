import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

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

  signIn(id: string): SignInResponseDto {
    const payload: JwtPayload = { sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
