import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GoogleUserDto } from './dtos/create-google-user.dto';
import { refreshJwtConfig } from '../config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    avatar: 'https://randomavatar.com',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    created_at: new Date(),
    updated_at: new Date(),
    password: 'abcdef',
  };
  const mockRefreshJwtConfig: ConfigType<typeof refreshJwtConfig> = {
    secret: 'test-secret',
    expiresIn: '1h',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByEmailWithPassword: jest.fn(),
          },
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshJwtConfig,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return a SafeUser if credentials are correct', async () => {
      jest
        .spyOn(userService, 'findByEmailWithPassword')
        .mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      const result = await authService.validateUser(mockUser.email, 'valid-pw');
      expect(result).toEqual(mockUser);
    });
    it('should return UnauthorizedException if email is invalid', async () => {
      jest
        .spyOn(userService, 'findByEmailWithPassword')
        .mockResolvedValue(null);
      await expect(
        authService.validateUser(mockUser.email, 'some-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should return UnauthorizedException if password is invalid', async () => {
      jest
        .spyOn(userService, 'findByEmailWithPassword')
        .mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(
        authService.validateUser(mockUser.email, 'some-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return a SignInResponse if id is correct', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);
      const acess_token: string = 'abcdef';
      const refresh_token: string = 'refresh-token';
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(acess_token)
        .mockResolvedValueOnce(refresh_token);

      const result = await authService.signIn(mockUser.id);
      expect(result).toEqual({
        access_token: acess_token,
        refresh_token: refresh_token,
        user_info: mockUser,
      });
    });
    it('should return BadRequest if id is inexistent or invalid', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);
      await expect(authService.signIn('dummy-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signUp', () => {
    it('should return a SignUpResponse if credentials are valid', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      const acess_token: string = 'abcdef';
      const refresh_token: string = 'refresh-token';
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(acess_token)
        .mockResolvedValueOnce(refresh_token);

      const result = await authService.signUp({
        ...mockUser,
        password: '123456',
      });
      expect(result).toEqual({
        access_token: acess_token,
        refresh_token: refresh_token,
        user_info: mockUser,
      });
    });
    it('should return BadRequest if user already exist', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(
        authService.signUp({
          ...mockUser,
          password: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateGoogleUser', () => {
    const googleUserDto: GoogleUserDto = {
      avatar: mockUser.avatar,
      email: mockUser.email,
      first_name: mockUser.first_name,
      last_name: mockUser.last_name,
    };
    it('should return a new created user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      const result = await authService.validateGoogleUser(googleUserDto);
      expect(result).toStrictEqual(mockUser);
      expect(jest.spyOn(userService, 'create')).toHaveBeenCalledWith({
        ...googleUserDto,
        password: '',
      });
    });
    it('should return an existing user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await authService.validateGoogleUser(googleUserDto);
      expect(result).toStrictEqual(mockUser);
      expect(jest.spyOn(userService, 'create')).toHaveBeenCalledTimes(0);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token sucessfully', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('some-token');
      expect(await authService.refreshToken(mockUser.id)).toEqual({
        id: mockUser.id,
        access_token: 'some-token',
      });
    });
  });
});
