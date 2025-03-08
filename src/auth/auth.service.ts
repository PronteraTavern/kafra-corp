import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidatedUserDto } from 'src/users/dtos/validated-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dtos/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUserDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password_hash === pass) {
      const { password_hash, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: ValidatedUserDto): LoginResponse {
    const payload: JwtPayload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
