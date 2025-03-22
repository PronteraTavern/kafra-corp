import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Public } from '../public.decorator';

// @UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  // @Post()
  // create(@Body() createTripDto: CreateTripDto) {
  //   return this.tripsService.create(createTripDto);
  // }

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
