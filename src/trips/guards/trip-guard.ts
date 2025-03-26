import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TripsService } from '../trip/trips.service';
import { TripStatus } from '../trip/entities/trip.entity';
import { AuthenticatedTripRequest } from '../interfaces/authenticated-trip-request.interface';

/**
 * To use this Guard, you need to ensure that you have a `:tripId` as param
 * This Guards validates the existence of the trip and its status, then injects the trip object into the request
 */
@Injectable()
export class TripGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tripService: TripsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedTripRequest>();
    const tripId = request.params.tripId; // Extract trip ID from the request params

    // Verifies if the trip is cancelled.
    const trip = await this.tripService.findById(tripId);
    if (trip.status === TripStatus.CANCELLED) {
      throw new ForbiddenException(
        "The trip is cancelled, you can't modify it",
      );
    }
    request.trip = trip;
    return true;
  }
}
