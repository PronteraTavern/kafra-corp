import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from '../auth.service';
import { googleOAuthConfig } from '../../config/google-oauth.config';
import { SafeUserDto } from '../../users/dtos/safe-user.dto';
import { GooglePayload } from '../interfaces/google-payload.interface';
import { ConfigType } from '@nestjs/config';

describe('GoogleStrategy', () => {
  let googleStrategy: GoogleStrategy;
  let authService: AuthService;

  const mockUser: SafeUserDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    avatar: 'https://randomavatar.com',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockGoogleConfig: ConfigType<typeof googleOAuthConfig> = {
    clientId: 'test-client-id',
    secret: 'test-client-secret',
    callbackUrl: 'http://localhost:3000/auth/google/callback',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: googleOAuthConfig.KEY,
          useValue: mockGoogleConfig,
        },
        {
          provide: AuthService,
          useValue: {
            validateGoogleUser: jest.fn(),
          },
        },
      ],
    }).compile();

    googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return SafeUserDto if user validation succeeds', async () => {
    authService.validateGoogleUser = jest.fn().mockResolvedValue(mockUser);

    const done = jest.fn();
    const payload: GooglePayload = {
      _json: {
        email: 'test@example.com',
        picture: 'http://example.com/avatar.jpg',
        given_name: 'John',
        family_name: 'Doe',
      },
    };

    await googleStrategy.validate(
      'access_token',
      'refresh_token',
      payload,
      done,
    );

    expect(jest.spyOn(authService, 'validateGoogleUser')).toHaveBeenCalledWith({
      email: payload._json.email,
      avatar: payload._json.picture,
      first_name: payload._json.given_name,
      last_name: payload._json.family_name,
    });

    expect(done).toHaveBeenCalledWith(null, mockUser);
  });
});
