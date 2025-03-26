import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripMember } from './entities/trip-members.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TripMemberService {
  constructor(
    @InjectRepository(TripMember)
    private tripMembersRepository: Repository<TripMember>,
  ) {}

  async findBy(tripId: string, userId: string): Promise<TripMember | null> {
    return this.tripMembersRepository.findOne({
      where: {
        trip: { id: tripId },
        user: { id: userId },
      },
    });
  }
}
