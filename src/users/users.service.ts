import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ValidatedUserDto } from './dtos/validated-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRespository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRespository.findOneBy({ email });
  }

  async profile(id: string): Promise<ValidatedUserDto | null> {
    const user = await this.userRespository.findOneBy({ id });
    if (user) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
}
