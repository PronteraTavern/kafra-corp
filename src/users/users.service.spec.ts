import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SafeUserDto } from './dtos/safe-user.dto';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

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
    password_hash: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  };

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
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        avatar: mockUser.avatar,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
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
        email: createUserDto.email,
        password_hash: 'hashedpassword',
      });

      const random_date = new Date();
      userRepository.save = jest.fn().mockResolvedValue({
        id: 'generated-id',
        avatar: createUserDto.avatar,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
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

    it('should encrypt and update user password correctly', async () => {
      const newPassword: string = 'abcdef';
      const updateUserDto: UpdateUserDto = {
        password: newPassword,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('abcdef-hashed');
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ ...mockUser, password_hash: 'abcdef-hashed' });

      const expectedSafeUser: SafeUserDto = {
        id: mockUser.id,
        avatar: mockUser.avatar,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        email: mockUser.email,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      };
      const result = await usersService.update(mockUser.id, updateUserDto);
      expect(jest.spyOn(bcrypt, 'hashSync')).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(bcrypt, 'hashSync')).toHaveBeenCalledWith(
        newPassword,
        10,
      );

      expect(result).toEqual(expectedSafeUser);
    });
  });

  describe('find', () => {
    const users: SafeUserDto[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar1.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '987e6543-e89b-12d3-a456-426614174111',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        avatar: 'https://example.com/avatar2.png',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const result: Pagination<SafeUserDto> = {
      items: users,
      meta: {
        currentPage: 1,
        itemCount: 2,
        itemsPerPage: 10,
      },
    };
    it('should call paginate with the correct query builder and options', async () => {
      (paginate as jest.Mock).mockResolvedValue(result);
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };

      await usersService.find(paginationOptions);

      expect(
        jest.spyOn(userRepository, 'createQueryBuilder'),
      ).toHaveBeenCalledWith('users');
      expect(paginate).toHaveBeenCalledWith(
        expect.any(Object),
        paginationOptions,
      );
    });
    it('should return the paginated result', async () => {
      (paginate as jest.Mock).mockResolvedValue(result);
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };

      const response = await usersService.find(paginationOptions);
      expect(response).toEqual(result);
    });

    it('should handle empty results correctly', async () => {
      const emptyResult: Pagination<SafeUserDto> = {
        items: [],
        meta: { currentPage: 1, itemCount: 0, itemsPerPage: 10 },
      };
      (paginate as jest.Mock).mockResolvedValue(emptyResult);
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };

      const response = await usersService.find(paginationOptions);
      expect(response.items).toHaveLength(0);
    });
  });
});
