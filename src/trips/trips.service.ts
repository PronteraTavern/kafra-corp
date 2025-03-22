import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TripMember } from './entities/trip-members.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private tripMemberRepository: Repository<TripMember>,
  ) {}

  async findAll(userId: string) {
    const trips = await this.tripsRepository.find({
      relations: ['tripMembers', 'tripMembers.user'],

      where: {
        tripMembers: { user: { id: userId } },
      },
    });

    return trips;
  }
}
