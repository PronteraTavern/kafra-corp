import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    // Lucas - The logic above is to avoid a known issue in typeORM lib where findOneBy retrieves the first user db in case the input is null.
    // More info - https://github.com/typeorm/typeorm/issues/9316
    if (!email || email.trim() === '') {
      throw new BadRequestException();
    }
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    // Lucas - The logic above is to avoid a known issue in typeORM lib where findOneBy retrieves the first user db in case the input is null.
    // More info - https://github.com/typeorm/typeorm/issues/9316
    if (!id || id.trim() === '') {
      throw new BadRequestException();
    }
    return this.userRepository.findOneBy({ id });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // Explicitly include the password_hash field
      .where('user.email = :email', { email })
      .getOne();
  }

  async profile(id: string): Promise<User> {
    const user = await this.findById(id);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException();
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const createdUser: User = await this.userRepository.save(newUser);
    return createdUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();

    return;
  }

  async update(user: User, updatedUserDto: UpdateUserDto): Promise<User> {
    // Only update the password if it's provided
    if (updatedUserDto.password) {
      updatedUserDto.password = bcrypt.hashSync(updatedUserDto.password, 10);
    }

    // Merge the fields from updatedUserDto into the user object
    Object.assign(user, updatedUserDto);
    const updatedUser: User = await this.userRepository.save(user);
    return updatedUser;
  }
}
