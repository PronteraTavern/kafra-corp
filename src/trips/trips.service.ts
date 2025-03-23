import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

  async create(userId: string, createTripDto: CreateTripDto): Promise<void> {
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
