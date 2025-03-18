import { registerAs } from '@nestjs/config';

export const googleOAuthConfig = registerAs('googleOAuth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  secret: process.env.GOOGLE_SECRET!,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
}));
