import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { Trip, TripStatus } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { User } from '../../users/user.entity';
import {
  TripMember,
  TripRole,
} from '../trip-member/entities/trip-members.entity';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(user: User, createTripDto: CreateTripDto): Promise<Trip> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Begin transaction

    try {
      const tripsRepository = queryRunner.manager.getRepository(Trip);
      const tripMembersRepository =
        queryRunner.manager.getRepository(TripMember);

      const newTrip = tripsRepository.create({
        ...createTripDto,
        trip_owner: user,
      });
      const persistedTrip = await tripsRepository.save(newTrip);

      const newTripMember = tripMembersRepository.create({
        trip: persistedTrip,
        user,
        role: TripRole.ADMIN,
      });

      await tripMembersRepository.save(newTripMember);

      // Load trip members without including the full trip object
      const tripWithMembers = await tripsRepository.findOne({
        where: { id: persistedTrip.id },
        relations: ['tripMembers', 'tripMembers.user'],
      });

      if (!tripWithMembers) {
        throw new InternalServerErrorException();
      }

      await queryRunner.commitTransaction();
      return tripWithMembers;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release queryRunner to free up resources
      await queryRunner.release();
    }
  }

  async findAll(userId: string) {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);

    // TODO NEED TO BRING ALL INFO FROM TRIP
    const trips = await tripsRepository.find({});

    return trips;
  }

  async update(
    tripToUpdate: Trip,
    updateTripDto: UpdateTripDto,
  ): Promise<Trip> {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);

    // Modify fields
    Object.assign(tripToUpdate, updateTripDto);

    // Persist
    await tripsRepository.save(tripToUpdate);

    //Fetch full trip object
    const updatedTrip = await tripsRepository.find({
      relations: ['tripMembers', 'tripMembers.user'],

      where: {
        tripMembers: { trip: { id: tripToUpdate.id } },
      },
    });

    // Return
    return updatedTrip[0];
  }

  async remove(tripToDelete: Trip): Promise<void> {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);

    await tripsRepository.save({
      ...tripToDelete,
      status: TripStatus.CANCELLED,
    });

    return;
  }

  async findById(tripId: string): Promise<Trip> {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);
    // Fetch trip by Id
    const trip = await tripsRepository.findOneBy({ id: tripId });

    if (!trip) {
      throw new NotFoundException();
    }

    return trip;
  }
}
