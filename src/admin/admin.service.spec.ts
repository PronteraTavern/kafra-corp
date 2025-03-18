import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { SafeUserDto } from '../users/dtos/safe-user.dto';

describe('AdminService', () => {
  let adminService: AdminService;
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: UsersService,
          useValue: {
            find: jest.fn(),
            updateRole: jest.fn(),
          },
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    const users: SafeUserDto[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar1.png',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '987e6543-e89b-12d3-a456-426614174111',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        avatar: 'https://example.com/avatar2.png',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    it('should find a list of users', async () => {
      jest.spyOn(usersService, 'find').mockResolvedValue(users);

      expect(await adminService.listUsers({ skip: 0, limit: 2 })).toBe(users);
      expect(jest.spyOn(usersService, 'find')).toHaveBeenCalledWith({
        skip: 0,
        limit: 2,
      });
    });
    it('should find a list of empty users', async () => {
      jest.spyOn(usersService, 'find').mockResolvedValue([]);

      expect(await adminService.listUsers({ skip: 0, limit: 0 })).toEqual([]);
      expect(jest.spyOn(usersService, 'find')).toHaveBeenCalledWith({
        skip: 0,
        limit: 0,
      });
    });
  });
});
