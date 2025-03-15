import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { SafeUserDto } from '../users/dtos/safe-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

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
          },
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
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...mockUser, password_hash: '123456' });

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      const result = await authService.validateUser(mockUser.email, 'valid-pw');
      expect(result).toEqual(mockUser);
    });
    it('should return UnauthorizedException if email is invalid', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      await expect(
        authService.validateUser(mockUser.email, 'some-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should return UnauthorizedException if password is invalid', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue({ ...mockUser, password_hash: '123456' });

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(
        authService.validateUser(mockUser.email, 'some-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return a SignInResponse if id is correct', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockResolvedValue({ ...mockUser, password_hash: '123456' });
      const jwt: string = 'abcdef';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwt);

      const result = await authService.signIn(mockUser.id);
      expect(result).toEqual({
        access_token: jwt,
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
      const jwt: string = 'abcdef';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwt);

      const result = await authService.signUp({
        ...mockUser,
        password: '123456',
      });
      expect(result).toEqual({
        access_token: jwt,
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
});
