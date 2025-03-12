import { Test } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SafeUserDto } from './dtos/safe-user.dto';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UserController', () => {
  let usersController: UsersController;
  let userService: UsersService;

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

  describe('profile', () => {
    it('should return user profile info', async () => {
      const userProfile: SafeUserDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        avatar: 'https://randomavatar.com',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(userService, 'profile').mockResolvedValue(userProfile);
      expect(await usersController.profile(userProfile.id)).toBe(userProfile);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(userService, 'profile')
        .mockRejectedValue(new NotFoundException());

      await expect(usersController.profile('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call userService.profile with the correct id', async () => {
      const userProfile: SafeUserDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        avatar: 'https://randomavatar.com',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const spy = jest
        .spyOn(userService, 'profile')
        .mockResolvedValue(userProfile);

      await usersController.profile(userProfile.id);

      expect(spy).toHaveBeenCalledWith(userProfile.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
