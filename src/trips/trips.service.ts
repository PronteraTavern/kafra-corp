import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  create(user: User, _createTripDto: CreateTripDto) {
    console.log(user);
    // const new_trip = await this.tripsRepository.create({
    //   ...createTripDto,
    //   trip_owner: userId,
    // });
  }

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
