import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateTripDto } from './dto/create-trip.dto';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Trip } from './entities/trip.entity';
import { TripsService } from './trips.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createTripDto: CreateTripDto,
  ): Promise<Trip> {
    return this.tripsService.create(req.user, createTripDto);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<Trip[]> {
    return this.tripsService.findAll(req.user.id);
  }

  // @Patch(':tripId')
  // update(
  //   @Param('tripId') tripId: string,
  //   @Body() updateTripDto: UpdateTripDto,
  // ): Promise<Trip> {
  //   return this.tripsService.update(tripId, updateTripDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', @Request() req: AuthenticatedRequest) id: string) {
  //   return this.tripsService.remove(+id);
  // }
}
