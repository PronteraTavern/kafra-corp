import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { MembersService } from '../../members/members.service';
import { Reflector } from '@nestjs/core';
import { TripRole } from '../../members/entities/members.entity';
import { TripsService } from '../../trips.service';
import { AuthenticatedTripRequest } from '../interfaces/authenticated-trip-request.interface';

@Injectable()
export class TripAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tripMemberService: MembersService,
    private tripService: TripsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedTripRequest>();
    const userId = request.user.id; // Extract user from JWT
    const tripId = request.trip.id; // Extract trip ID from the request params

    // Verifies necessary privileges
    const tripMember = await this.tripMemberService.findBy(tripId, userId);

    if (!tripMember || tripMember.role !== TripRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to modify this trip',
      );
    }

    return true;
  }
}
