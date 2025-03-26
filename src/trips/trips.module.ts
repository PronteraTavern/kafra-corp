import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TripMember } from './trip-member/entities/trip-members.entity';
import { Trip } from './trip/entities/trip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trip/trips.controller';
import { TripsService } from './trip/trips.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Trip, TripMember]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
