import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET!,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION!,
  },
}));
