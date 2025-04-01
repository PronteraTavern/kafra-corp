import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripMember, TripRole } from './entities/trip-members.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/users.service';
import { Trip } from '../trip/entities/trip.entity';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

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
      relations: ['user'],
    });
  }

  async findByWithSoftDeleted(
    tripId: string,
    userId: string,
  ): Promise<TripMember | null> {
    return this.tripMembersRepository.findOne({
      where: {
        trip: { id: tripId },
        user: { id: userId },
      },
      relations: ['user'],
      withDeleted: true,
    });
  }

  async fetchTripMemberForReturn(tripMemberId: string): Promise<TripMember> {
    const tripMember = await this.tripMembersRepository.findOne({
      where: { id: tripMemberId },
      relations: ['user'], // Ensure user is loaded
    });

    if (!tripMember) {
      throw new NotFoundException();
    }

    return tripMember;
  }

  async addMember(trip: Trip, email: string): Promise<TripMember> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tripMember = await this.findByWithSoftDeleted(trip.id, user.id);
    // If there's no record on the table, we just create and persist the trip member
    if (!tripMember) {
      const createdMember = this.tripMembersRepository.create({
        user: { id: user.id },
        role: TripRole.MEMBER,
        trip: { id: trip.id },
      });

      const savedMember = await this.tripMembersRepository.save(createdMember);

      return this.fetchTripMemberForReturn(savedMember.id);
    } else {
      // If there's a record on the table we need to check if it's a deleted member to restore it.
      if (tripMember.deleted_at !== null) {
        const restoreResult = await this.tripMembersRepository
          .createQueryBuilder()
          .restore()
          .where('id = :id', { id: tripMember.id })
          .execute();

        if (restoreResult.affected !== 1) {
          throw new ConflictException('Something went wrong');
        }
        return this.fetchTripMemberForReturn(tripMember.id);
      }
      throw new ConflictException('This user is already a member of the trip');
    }
  }

  async updateMemberRole(
    trip: Trip,
    updateMemberRoleDto: UpdateMemberRoleDto,
  ): Promise<TripMember> {
    // Verifies if the given user is not the owner of the trip
    if (updateMemberRoleDto.email === trip.trip_owner.email) {
      throw new ForbiddenException("You can't modify roles of the trip owner");
    }
    // Verifies if user is a trip member
    const user = await this.userService.findByEmail(updateMemberRoleDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tripMember = await this.findBy(trip.id, user.id);
    if (!tripMember) {
      throw new ConflictException('This user is not a member of the trip');
    }

    tripMember.role = updateMemberRoleDto.role;
    const updatedMember = await this.tripMembersRepository.save(tripMember);

    return this.fetchTripMemberForReturn(updatedMember.id);
  }

  async removeMember(trip: Trip, email: string): Promise<void> {
    // Check if member is not the owner
    if (email === trip.trip_owner.email) {
      throw new ForbiddenException("You can't remove the trip owner");
    }
    // Check if member is in the trip
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tripMember = await this.findBy(trip.id, user.id);
    if (!tripMember) {
      throw new ConflictException('This user is not a member of the trip');
    }
    // Remove
    await this.tripMembersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: tripMember.id })
      .execute();
    //return

    return;
  }
}
