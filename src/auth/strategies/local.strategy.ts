import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SafeUserDto } from '../../users/dtos/safe-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<SafeUserDto> {
    if (password.trim() === '') {
      throw new UnauthorizedException('Please provide a password');
    }
    return this.authService.validateUser(email, password);
  }
}
