import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    avatar: 'https://randomavatar.com',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const { password, ...mockUserWithoutPassword } = mockUser;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return the user that was found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      expect(await usersService.findByEmail(mockUser.email)).toStrictEqual(
        mockUser,
      );
    });
    it('should return null if no user was found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      expect(await usersService.findByEmail('random-email')).toBe(null);
    });
    it('should throw BadRequest if email is undefined or empty', async () => {
      await expect(usersService.findByEmail('')).rejects.toThrow(
        BadRequestException,
      );
      expect(jest.spyOn(userRepository, 'findOneBy')).toHaveBeenCalledTimes(0);
    });
  });

  describe('findById', () => {
    it('should return the user that was found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      expect(await usersService.findById(mockUser.id)).toStrictEqual(mockUser);
    });
    it('should return null if no user was found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      expect(await usersService.findById('random-id')).toBe(null);
    });
    it('should throw BadRequest if id is undefined', async () => {
      await expect(usersService.findById('')).rejects.toThrow(
        BadRequestException,
      );
      expect(jest.spyOn(userRepository, 'findOneBy')).toHaveBeenCalledTimes(0);
    });
  });

  describe('profile', () => {
    it('should return a user profile without password', async () => {
      userRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(mockUserWithoutPassword);

      const result = await usersService.profile(mockUser.id);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(usersService.profile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user and return a SafeUserDto', async () => {
      const createUserDto: CreateUserDto = {
        avatar: 'http://randomavatar.com',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'securepassword',
      };

      userRepository.findOneBy = jest.fn().mockResolvedValue(null);
      userRepository.create = jest.fn().mockReturnValue({
        avatar: createUserDto.avatar,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        email: createUserDto.email,
        password: 'hashedpassword',
      });

      userRepository.save = jest
        .fn()
        .mockResolvedValue(mockUserWithoutPassword);

      const result = await usersService.create(createUserDto);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw BadRequest if email is already in use', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      await expect(
        usersService.create({ ...mockUser, password: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update user details and return a SafeUserDto', async () => {
      const updated_name = 'Updated Name';
      const updateUserDto: UpdateUserDto = { first_name: updated_name };
      userRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(mockUserWithoutPassword);
      userRepository.save = jest.fn().mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await usersService.update(mockUser, updateUserDto);
      expect(result).toEqual({ ...mockUser, first_name: updated_name });
    });

    it('should encrypt and update user password correctly', async () => {
      const newPassword: string = 'abcdef';
      const updateUserDto: UpdateUserDto = {
        password: newPassword,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('abcdef-hashed');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await usersService.update(mockUser, updateUserDto);
      expect(jest.spyOn(bcrypt, 'hashSync')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(bcrypt, 'hashSync')).toHaveBeenCalledWith(
        newPassword,
        10,
      );

      expect(result).toBe(mockUser);
    });
  });
});
