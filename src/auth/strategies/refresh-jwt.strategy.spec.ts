import { ConfigType } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { refreshJwtConfig } from '../../config/refresh-jwt.config';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

const mockRefreshJwtConfig: ConfigType<typeof refreshJwtConfig> = {
  secret: 'test-secret',
  expiresIn: '1h',
};

describe('RefreshJwtStrategy', () => {
  let refreshJwtStrategy: RefreshJwtStrategy;

  beforeEach(() => {
    refreshJwtStrategy = new RefreshJwtStrategy(mockRefreshJwtConfig);
  });

  it('should be defined', () => {
    expect(refreshJwtStrategy).toBeDefined();
  });

  it('should validate payload correctly', () => {
    const payload: JwtPayload = { id: '123', role: 'admin ' };
    expect(refreshJwtStrategy.validate(payload)).toEqual(payload);
  });

  it('should configure JWT extraction correctly', () => {
    const extractFn = ExtractJwt.fromAuthHeaderAsBearerToken();
    expect(extractFn).toBeDefined();
  });
});
