import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SafeUserDto } from './dtos/safe-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async profile(id: string): Promise<SafeUserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      const { password_hash, ...result } = user;
      return result;
    }
    throw new NotFoundException();
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      //Lucas - This is probably wrong.
      throw new BadRequestException();
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    const createdUser: User = await this.userRepository.save(newUser);
    const { password_hash, ...result } = createdUser;

    return result;
  }

  async remove(id: string): Promise<SafeUserDto> {
    const user = await this.findById(id);
    if (!user) {
      //Lucas - This is probably wrong.
      throw new NotFoundException();
    }
    const deletedUser = await this.userRepository.remove(user);
    const { password_hash, ...result } = deletedUser;

    return result;
  }

  async update(
    id: string,
    updatedUserDto: UpdateUserDto,
  ): Promise<SafeUserDto> {
    const user = await this.findById(id);
    if (!user) {
      //Lucas - This is probably wrong.
      throw new NotFoundException();
    }
    if (updatedUserDto.password) {
      user.password_hash = await bcrypt.hash(updatedUserDto.password, 10);
    }
    if (updatedUserDto.email) {
      user.email = updatedUserDto.email;
    }
    if (updatedUserDto.name) {
      user.name = updatedUserDto.name;
    }

    const updatedUser: User = await this.userRepository.save(user);
    const { password_hash, ...result } = updatedUser;

    return result;
  }
}
