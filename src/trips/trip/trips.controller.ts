import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateTripDto } from './dto/create-trip.dto';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Trip } from './entities/trip.entity';
import { TripsService } from './trips.service';
import { TripAdminGuard } from '../guards/trip-admin.guard';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripGuard } from '../guards/trip-guard';
import { AuthenticatedTripRequest } from '../interfaces/authenticated-trip-request.interface';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Trip was created',
  })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createTripDto: CreateTripDto,
  ): Promise<Trip> {
    return this.tripsService.create(req.user, createTripDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Trips were found',
  })
  async findAll(@Request() req: AuthenticatedRequest): Promise<Trip[]> {
    return this.tripsService.findAll(req.user.id);
  }

  @UseGuards(TripGuard, TripAdminGuard)
  @Patch(':tripId')
  @ApiResponse({
    status: 200,
    description: 'Trip was updated',
  })
  @ApiResponse({
    status: 403,
    description: 'User has no privilege to update this trip',
  })
  @ApiResponse({
    status: 404,
    description:
      'For some reason this trip was deleted right after the request',
  })
  update(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<Trip> {
    return this.tripsService.update(req.trip, updateTripDto);
  }

  @HttpCode(204)
  @UseGuards(TripGuard, TripAdminGuard)
  @Delete(':tripId')
  @ApiResponse({
    status: 204,
    description: 'Trip was deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'User has no privilege to delete this trip',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  remove(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
  ): Promise<void> {
    return this.tripsService.remove(req.trip);
  }
}
