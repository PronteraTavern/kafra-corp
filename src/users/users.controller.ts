import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ValidatedUserDto } from './dtos/validated-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ValidatedUserDto | null> {
    return await this.userService.profile(req.user.id);
  }
}
