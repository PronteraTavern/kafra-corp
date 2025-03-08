import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ValidatedUserDto } from './dtos/validated-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRespository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRespository.findOneBy({ email });
  }

  findById(id: string): Promise<User | null> {
    return this.userRespository.findOneBy({ id });
  }

  async profile(id: string): Promise<ValidatedUserDto> {
    const user = await this.userRespository.findOneBy({ id });
    if (user) {
      const { password_hash, ...result } = user;
      return result;
    }
    throw new NotFoundException();
  }

  async create(createUserDto: CreateUserDto): Promise<ValidatedUserDto> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      //Lucas - This is probably wrong.
      throw new BadRequestException();
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRespository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    const createdUser: User = await this.userRespository.save(newUser);
    const { password_hash, ...result } = createdUser;

    return result;
  }

  async remove(id: string): Promise<ValidatedUserDto> {
    const user = await this.findById(id);
    if (!user) {
      //Lucas - This is probably wrong.
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const deletedUser = await this.userRespository.remove(user);
    const { password_hash, ...result } = deletedUser;

    return result;
  }
}
