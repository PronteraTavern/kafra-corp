import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TripsService } from '../../trips.service';
import { AuthenticatedTripRequest } from '../interfaces/authenticated-trip-request.interface';

/**
 * To use this Guard, you need to ensure that you have a `:tripId` as param
 * This Guards validates the existence of the trip, then injects the trip object into the request
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

    const trip = await this.tripService.findOne(tripId);
    request.trip = trip;
    return true;
  }
}
