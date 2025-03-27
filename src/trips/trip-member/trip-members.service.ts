import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripMember, TripRole } from './entities/trip-members.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/users.service';
import { Trip } from '../trip/entities/trip.entity';

@Injectable()
export class TripMemberService {
  constructor(
    @InjectRepository(TripMember)
    private tripMembersRepository: Repository<TripMember>,
    private userService: UsersService,
  ) {}

  async findBy(tripId: string, userId: string): Promise<TripMember | null> {
    return this.tripMembersRepository.findOne({
      where: {
        trip: { id: tripId },
        user: { id: userId },
      },
    });
  }

  async addMember(trip: Trip, email: string): Promise<TripMember> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tripMember = await this.findBy(trip.id, user.id);
    if (tripMember) {
      throw new ConflictException('This user is already a member of the trip');
    }

    const createdMember = this.tripMembersRepository.create({
      user,
      role: TripRole.MEMBER,
      trip,
    });

    return await this.tripMembersRepository.save(createdMember);
  }
}
