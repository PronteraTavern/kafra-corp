import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SafeUserDto } from './dtos/safe-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

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

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('profile', () => {
    it('should return a user profile without password', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        avatar: mockUser.avatar,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
        role: mockUser.role,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      };

      const result = await usersService.profile(mockUser.id);
      expect(result).toEqual(expectedSafeUser);
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
        role: 'user',
        email: createUserDto.email,
        password_hash: 'hashedpassword',
      });

      const random_date = new Date();
      userRepository.save = jest.fn().mockResolvedValue({
        id: 'generated-id',
        avatar: createUserDto.avatar,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        role: 'user',
        email: createUserDto.email,
        password_hash: 'hashedpassword',
        created_at: random_date,
        updated_at: random_date,
      });

      const result = await usersService.create(createUserDto);
      expect(result).toEqual<SafeUserDto>({
        id: 'generated-id',
        avatar: createUserDto.avatar,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        role: 'user',
        email: createUserDto.email,
        created_at: random_date,
        updated_at: random_date,
      });
    });

    it('should throw BadRequest if email is already in use', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      await expect(
        usersService.create({ ...mockUser, password: 'test' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a user and return nothing', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      userRepository.remove = jest.fn().mockResolvedValue(mockUser);

      expect(await usersService.remove(mockUser.id)).toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(usersService.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user details and return a SafeUserDto', async () => {
      const updated_name = 'Updated Name';
      const updateUserDto: UpdateUserDto = { first_name: updated_name };
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        avatar: mockUser.avatar,
        first_name: updated_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
        role: mockUser.role,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      };

      const result = await usersService.update(mockUser.id, updateUserDto);
      expect(result).toEqual(expectedSafeUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(usersService.update('invalid-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
