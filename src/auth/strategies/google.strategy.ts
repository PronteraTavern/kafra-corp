import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GooglePayload } from '../interfaces/google-payload.interface';
import { googleOAuthConfig } from '../../config/google-oauth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOAuthConfig.KEY)
    private googleConfig: ConfigType<typeof googleOAuthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.secret,
      callbackURL: googleConfig.callbackUrl,
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
