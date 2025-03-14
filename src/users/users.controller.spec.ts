import { Test } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SafeUserDto } from './dtos/safe-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

describe('UserController', () => {
  let usersController: UsersController;
  let userService: UsersService;

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

  const updateUserDto: UpdateUserDto = {
    avatar: 'http://newurl.com',
    email: 'new@email.com',
    first_name: 'newFirstName',
    last_name: 'newLastName',
    password: 'newPassword',
  };
  const updatedMockUser: SafeUserDto = {
    ...mockUser,
    ...updateUserDto,
    updated_at: new Date(),
  };

  const mockAdminRequest: AuthenticatedRequest = {
    user: {
      id: 'mock-user-id',
      role: 'admin',
    },
  } as AuthenticatedRequest;

  const mockUserRequest: AuthenticatedRequest = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: 'user',
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = moduleRef.get(UsersService);
    usersController = moduleRef.get(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('profile', () => {
    it('should return user profile info', async () => {
      jest.spyOn(userService, 'profile').mockResolvedValue(mockUser);
      const result = await usersController.profile(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(userService, 'profile')
        .mockRejectedValue(new NotFoundException());

      await expect(usersController.profile('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should call service profile with the correct id', async () => {
      jest.spyOn(userService, 'profile').mockResolvedValue(mockUser);
      await usersController.profile(mockUser.id);
      expect(jest.spyOn(userService, 'profile')).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });

  describe('delete', () => {
    it('should delete user as own user', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValue(undefined);
      const response = await usersController.delete(
        mockUserRequest,
        mockUser.id,
      );
      expect(jest.spyOn(userService, 'remove')).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(response).toBeUndefined();
    });
  });

  it('should delete user as an admin', async () => {
    jest.spyOn(userService, 'remove').mockResolvedValue(undefined);
    const response = await usersController.delete(
      mockAdminRequest,
      mockUser.id,
    );
    expect(jest.spyOn(userService, 'remove')).toHaveBeenCalledWith(mockUser.id);
    expect(response).toBeUndefined();
  });

  it('should throw NotFoundException if user doesnt exist', async () => {
    jest
      .spyOn(userService, 'remove')
      .mockRejectedValue(new NotFoundException());

    await expect(
      usersController.delete(mockAdminRequest, 'dummy-id'),
    ).rejects.toThrow(NotFoundException);

    expect(jest.spyOn(userService, 'remove')).toHaveBeenCalledWith('dummy-id');
  });

  it('should throw UnauthorizedException if not admin neither own user', async () => {
    await expect(
      usersController.delete(mockUserRequest, 'dummy-id'),
    ).rejects.toThrow(UnauthorizedException);

    expect(jest.spyOn(userService, 'remove')).toHaveBeenCalledTimes(0);
  });

  describe('update', () => {
    it('should update user as own user', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue(updatedMockUser);

      const result = await usersController.update(
        mockUserRequest,
        mockUser.id,
        updateUserDto,
      );
      expect(result).toBe(updatedMockUser);
      expect(jest.spyOn(userService, 'update')).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
    });
  });

  it('should update user as an admin', async () => {
    jest.spyOn(userService, 'update').mockResolvedValue(updatedMockUser);

    const result = await usersController.update(
      mockAdminRequest,
      mockUser.id,
      updateUserDto,
    );
    expect(result).toBe(updatedMockUser);
    expect(jest.spyOn(userService, 'update')).toHaveBeenCalledWith(
      mockUser.id,
      updateUserDto,
    );
  });

  it('should thow NotFound if user doesnt exist', async () => {
    jest
      .spyOn(userService, 'update')
      .mockRejectedValue(new NotFoundException());

    const result = usersController.update(
      mockAdminRequest,
      mockUser.id,
      updateUserDto,
    );
    await expect(result).rejects.toThrow(NotFoundException);
    expect(jest.spyOn(userService, 'update')).toHaveBeenCalledWith(
      mockUser.id,
      updateUserDto,
    );
  });

  it('should thow Unauthorized if not admin neither own user', async () => {
    const result = usersController.update(
      mockUserRequest,
      'dummy-id',
      updateUserDto,
    );
    await expect(result).rejects.toThrow(UnauthorizedException);
    expect(jest.spyOn(userService, 'update')).toHaveBeenCalledTimes(0);
  });
});
