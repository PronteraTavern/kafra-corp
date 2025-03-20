import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dtos/signin-response.dto';
import { SafeUserDto } from 'src/users/dtos/safe-user.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { SignInRequestDto } from './dtos/signin-request.dto';
import { SignUpResponseDto } from './dtos/signup-response.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

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
            refreshToken: jest.fn(),
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
    it('should return an access token and user info on successful sign-in', async () => {
      const signInResponse: SignInResponseDto = {
        access_token: 'mocked-jwt',
        refresh_token: 'refresh-token',
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
  });
  describe('signUp', () => {
    it('should return an access token and user info on successful sign-up', async () => {
      const mockResponse: SignUpResponseDto = {
        access_token: 'mocked_token',
        refresh_token: 'refresh-token',
        user_info: mockUser,
      };
      jest.spyOn(authService, 'signUp').mockResolvedValue(mockResponse);

      const dto: CreateUserDto = {
        ...mockUser,
        password: '123456',
      };
      const result = await authController.signUp(dto);

      expect(result).toEqual(mockResponse);
      expect(jest.spyOn(authService, 'signUp')).toHaveBeenCalledWith(dto);
    });
  });
  describe('googleCallback', () => {
    it('should succesfully redirect to another url and return jwt', async () => {
      const signInResponse: SignInResponseDto = {
        access_token: 'mocked-jwt',
        refresh_token: 'refresh-token',
        user_info: mockUser,
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(signInResponse);
      const result = await authController.googleCallback(mockUserRequest);

      expect(result).toEqual({
        url: `http://localhost:3000?token=mocked-jwt`,
      });
      expect(jest.spyOn(authService, 'signIn')).toHaveBeenCalledWith(
        mockUserRequest.user.id,
      );
    });
    it('should throw BadRequest if user doest not exist', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new BadRequestException());
      await expect(
        authController.googleCallback(mockUserRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should return an access token and user info on successful refreshToken', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        id: mockUser.id,
        access_token: 'access_token',
      };

      jest
        .spyOn(authService, 'refreshToken')
        .mockResolvedValue(refreshTokenDto);
      expect(await authController.refreshToken(mockUserRequest)).toBe(
        refreshTokenDto,
      );
    });
  });
});
