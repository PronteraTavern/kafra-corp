import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { SignInRequestDto } from './dtos/signin-request.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser: SafeUserDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    avatar: 'https://randomavatar.com',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserRequest: AuthenticatedRequest = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: 'user',
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('should work with correct credentials', async () => {
      const signInResponse: SignInResponseDto = {
        access_token: 'mocked-jwt',
        user_info: mockUser,
      };
      const signInRequest: SignInRequestDto = {
        email: mockUser.email,
        password: '123456',
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(signInResponse);
      expect(await authController.signIn(mockUserRequest, signInRequest)).toBe(
        signInResponse,
      );
    });
    it('should throw Unauthroized work with inccorrect credentials', async () => {});
  });
});
