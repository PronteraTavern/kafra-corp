import { UseGuards, Controller, Patch, Param, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TripMemberService } from './trip-members.service';
import { TripMember } from './entities/trip-members.entity';
import { TripGuard } from '../guards/trip-guard';
import { AuthenticatedTripRequest } from '../interfaces/authenticated-trip-request.interface';

@UseGuards(JwtAuthGuard, TripGuard, TripMember)
@ApiBearerAuth()
@Controller('trips/:tripId/members')
export class TripMemberController {
  constructor(private tripsService: TripMemberService) {}

  @Patch(':email')
  @ApiResponse({
    status: 200,
    description: 'User sucessfully added to the trip',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of the trip',
  })
  async addMember(
    @Param('tripId') _tripId: string,
    @Param('email') email: string,
    @Request() req: AuthenticatedTripRequest,
  ): Promise<TripMember> {
    return this.tripsService.addMember(req.trip, email);
  }
}
