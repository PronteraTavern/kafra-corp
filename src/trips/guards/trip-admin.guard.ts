import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TripMemberService } from '../trip-member/trip-members.service';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { TripRole } from '../trip-member/entities/trip-members.entity';

@Injectable()
export class TripAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tripMemberService: TripMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user.id; // Extract user from JWT
    const tripId = request.params.tripId; // Extract trip ID from the request params

    const tripMember = await this.tripMemberService.findBy(tripId, userId);
    if (!tripMember || tripMember.role !== TripRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to modify this trip',
      );
    }

    return true;
  }
}
