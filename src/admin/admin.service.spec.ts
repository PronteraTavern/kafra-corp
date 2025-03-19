import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { SafeUserDto } from '../users/dtos/safe-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

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
    const result: Pagination<SafeUserDto> = {
      items: users,
      meta: {
        currentPage: 1,
        itemCount: 2,
        itemsPerPage: 10,
      },
    };
    it('should find a list of users', async () => {
      jest.spyOn(usersService, 'find').mockResolvedValue(result);

      expect(
        await adminService.listUsers({ limit: 10, page: 1 }, 'admin/'),
      ).toBe(result);
      expect(jest.spyOn(usersService, 'find')).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        route: 'admin/',
      });
    });
  });
});
