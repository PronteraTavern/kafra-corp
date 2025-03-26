import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TripMember } from './trip-member/entities/trip-members.entity';
import { Trip } from './trip/entities/trip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trip/trips.controller';
import { TripsService } from './trip/trips.service';
import { TripMemberService } from './trip-member/trip-members.service';
import { TripMemberController } from './trip-member/trip-member.controller';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Trip, TripMember]),
  ],
  controllers: [TripsController, TripMemberController],
  providers: [TripsService, TripMemberService],
})
export class TripsModule {}
