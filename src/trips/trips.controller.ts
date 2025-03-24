import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';

import { Public } from '../public.decorator';
import { CreateTripDto } from './dto/create-trip.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createTripDto: CreateTripDto,
  ) {
    return this.tripsService.create(req.user, createTripDto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.tripsService.findAll('5288867d-19b1-43e6-96dd-1a58ec319f09');
  }

  // @Get(':id')
  // findOne(@Param('id', @Request() req: AuthenticatedRequest) id: string) {
  //   return this.tripsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id', @Request() req: AuthenticatedRequest) id: string, @Body() updateTripDto: UpdateTripDto) {
  //   return this.tripsService.update(+id, updateTripDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', @Request() req: AuthenticatedRequest) id: string) {
  //   return this.tripsService.remove(+id);
  // }
}
