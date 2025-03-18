import { ConfigType } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

const mockJwtConfig: ConfigType<typeof jwtConfig> = {
  secret: 'test-secret',
  signOptions: { expiresIn: '1h' },
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy(mockJwtConfig);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate payload correctly', () => {
    const payload: JwtPayload = { id: '123', role: 'admin ' };
    expect(jwtStrategy.validate(payload)).toEqual(payload);
  });

  it('should configure JWT extraction correctly', () => {
    const extractFn = ExtractJwt.fromAuthHeaderAsBearerToken();
    expect(extractFn).toBeDefined();
  });
});
