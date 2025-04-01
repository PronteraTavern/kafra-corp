import { AuthenticatedRequest } from '../../../auth/interfaces/authenticated-request.interface';
import { Trip } from '../../entities/trip.entity';

/**
 * This is an authenticated request, meaning that JWT was previously validated and there's an object user inside of it.
 */
export interface AuthenticatedTripRequest extends AuthenticatedRequest {
  trip: Trip;
}
