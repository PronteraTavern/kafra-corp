import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TripMember } from './entities/trip-members.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private tripMemberRepository: Repository<TripMember>,
  ) {}
  // create(createTripDto: CreateTripDto) {
  //   return 'This action adds a new trip';
  // }

  async findAll(userId: string) {
    const tripMembers = await this.tripsRepository
      .createQueryBuilder('trips')
      .innerJoin('trip_members', 'tm', `tm.user_id = '${userId}'`)
      .getMany();

    console.log('Deu bom');
    console.log(tripMembers);
    return tripMembers;

    // return tripMembers.map((tripMember) => tripMember.trip);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} trip`;
  // }

  // update(id: number, updateTripDto: UpdateTripDto) {
  //   return `This action updates a #${id} trip`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} trip`;
  // }
}
