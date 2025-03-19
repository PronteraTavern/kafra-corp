import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SafeUserDto } from '../users/dtos/safe-user.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('AdminService', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            listUsers: jest.fn(),
            updateRole: jest.fn(),
          },
        },
      ],
    }).compile();

    adminController = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
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
    it('should return a list of users', async () => {
      jest.spyOn(adminService, 'listUsers').mockResolvedValue(result);

      expect(await adminController.listUsers({ limit: 10, page: 1 })).toBe(
        result,
      );
      expect(jest.spyOn(adminService, 'listUsers')).toHaveBeenCalledWith(
        { limit: 10, page: 1 },
        '/admin',
      );
    });
  });
});
