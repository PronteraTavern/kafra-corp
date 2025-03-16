import { Test } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { SafeUserDto } from '../../users/dtos/safe-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const mockUser: SafeUserDto = {
    id: '123',
    avatar: 'https://randomavatar.com',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();
    localStrategy = moduleRef.get(LocalStrategy);
    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return a user if validation succeeds', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      const result = await localStrategy.validate(mockUser.email, 'password');
      expect(result).toEqual(mockUser);
      expect(jest.spyOn(authService, 'validateUser')).toHaveBeenCalledWith(
        mockUser.email,
        'password',
      );
    });
    it('should throw UnauthorizedException if password is empty', async () => {
      const result = localStrategy.validate('some-email', '');
      await expect(result).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockRejectedValue(new UnauthorizedException());

      const result = localStrategy.validate('some-email', 'password');
      await expect(result).rejects.toThrow(UnauthorizedException);
      expect(jest.spyOn(authService, 'validateUser')).toHaveBeenCalledWith(
        'some-email',
        'password',
      );
    });
  });
});
