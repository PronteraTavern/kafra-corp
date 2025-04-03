import { Injectable, NotFoundException } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { Trip, TripStatus } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { User } from '../users/user.entity';
import { Member, TripRole } from './members/entities/members.entity';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly dataSource: DataSource) {}

  async findOne(id: string): Promise<Trip> {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);

    const trip = await tripsRepository.findOne({
      where: { id },
      relations: [
        'trip_owner',
        'tripMembers',
        'tripMembers.user',
        'checklistItems',
        'shoppingItems',
      ],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async findOneForTransactions(
    id: string,
    tripsRepository: Repository<Trip>,
  ): Promise<Trip> {
    const trip = await tripsRepository.findOne({
      where: { id },
      relations: [
        'trip_owner',
        'tripMembers',
        'tripMembers.user',
        'checklistItems',
        'shoppingItems',
      ],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async create(user: User, createTripDto: CreateTripDto): Promise<Trip> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // Begin transaction

    try {
      const tripsRepository = queryRunner.manager.getRepository(Trip);
      const tripMembersRepository = queryRunner.manager.getRepository(Member);

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
      const fullTripObject = await this.findOneForTransactions(
        persistedTrip.id,
        tripsRepository,
      );

      await queryRunner.commitTransaction();
      return fullTripObject;
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

    const trips = await tripsRepository
      .createQueryBuilder('trip')
      .innerJoin(
        'trip.tripMembers',
        'tripMember',
        'tripMember.user_id = :userId',
        { userId },
      )
      .leftJoinAndSelect('trip.trip_owner', 'trip_owner')

      .leftJoinAndSelect('trip.tripMembers', 'tripMembers')
      .leftJoinAndSelect('tripMembers.user', 'memberUser')

      .leftJoinAndSelect('trip.checklistItems', 'checklistItems')
      .leftJoinAndSelect('checklistItems.assignee', 'itemAssignee')

      .leftJoinAndSelect('trip.shoppingItems', 'shoppingItems')
      .leftJoinAndSelect('shoppingItems.suggestedBy', 'shoppingItemSuggestedBy')

      .getMany();

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
    const fullTripObject = await this.findOne(tripToUpdate.id);

    return fullTripObject;
  }

  async remove(tripToDelete: Trip): Promise<void> {
    const tripsRepository = this.dataSource.manager.getRepository(Trip);

    await tripsRepository.save({
      ...tripToDelete,
      status: TripStatus.CANCELLED,
    });

    return;
  }
}
