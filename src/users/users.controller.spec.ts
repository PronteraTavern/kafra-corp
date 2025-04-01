import { Test } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { User } from './user.entity';

describe('UserController', () => {
  let usersController: UsersController;
  let userService: UsersService;

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

  const updateUserDto: UpdateUserDto = {
    avatar: 'http://newurl.com',
    email: 'new@email.com',
    first_name: 'newFirstName',
    last_name: 'newLastName',
    password: 'newPassword',
  };
  const updatedMockUser: User = {
    ...mockUser,
    ...updateUserDto,
    updated_at: new Date(),
  };

  const mockUserRequest: AuthenticatedRequest = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
    },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            profile: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get(UsersService);
    usersController = moduleRef.get(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    it('should delete user as own user', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValue(undefined);
      const response = await usersController.delete(mockUserRequest);
      expect(response).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update user as own user', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue(updatedMockUser);

      const result = await usersController.update(
        mockUserRequest,
        updateUserDto,
      );
      expect(result).toBe(updatedMockUser);
    });
  });
});
