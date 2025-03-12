import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SafeUserDto } from './dtos/safe-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    password_hash: 'hashedpassword',
    created_at: new Date(),
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
        name: mockUser.name,
        email: mockUser.email,
        created_at: mockUser.created_at,
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
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'securepassword',
      };

      userRepository.findOneBy = jest.fn().mockResolvedValue(null);
      userRepository.create = jest.fn().mockReturnValue({
        name: createUserDto.name,
        email: createUserDto.email,
        password_hash: 'hashedpassword',
      });

      const random_date = new Date();
      userRepository.save = jest.fn().mockResolvedValue({
        id: 'generated-id',
        name: createUserDto.name,
        email: createUserDto.email,
        password_hash: 'hashedpassword',
        created_at: random_date,
      });

      const result = await usersService.create(createUserDto);
      expect(result).toEqual<SafeUserDto>({
        id: 'generated-id',
        name: createUserDto.name,
        email: createUserDto.email,
        created_at: random_date,
      });
    });

    it('should throw ConflictExcpetion if email is already in use', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      await expect(
        usersService.create({ ...mockUser, password: 'test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a user and return a SafeUserDto', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      userRepository.remove = jest.fn().mockResolvedValue(mockUser);

      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        created_at: mockUser.created_at,
      };

      expect(await usersService.remove(mockUser.id)).toEqual(expectedSafeUser);
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
      const updateUserDto: UpdateUserDto = { name: updated_name };
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        name: updated_name,
        email: mockUser.email,
        created_at: mockUser.created_at,
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
