import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GooglePayload } from '../interfaces/google-payload.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    // Lucas - This will be changed for the appropriate implementation
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'You need to initialize env variables for GoogleStrategy',
      );
    }
    super({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    payload: GooglePayload,
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateGoogleUser({
      email: payload._json.email,
      avatar: payload._json.picture,
      first_name: payload._json.given_name,
      last_name: payload._json.family_name,
    });
    done(null, user);
  }
}
