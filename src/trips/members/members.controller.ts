import {
  UseGuards,
  Controller,
  Patch,
  Param,
  Request,
  Body,
  Post,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MembersService } from './members.service';
import { Member } from './entities/members.entity';
import { TripGuard } from '../common/guards/trip-guard';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { TripAdminGuard } from '../common/guards/trip-admin.guard';
import { AuthenticatedTripRequest } from '../common/interfaces/authenticated-trip-request.interface';

@UseGuards(JwtAuthGuard, TripGuard, Member)
@ApiBearerAuth()
@Controller('trips/:tripId/members')
export class MembersController {
  constructor(private tripMembersService: MembersService) {}

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
  ): Promise<Member> {
    return this.tripMembersService.addMember(req.trip, email);
  }

  @UseGuards(TripAdminGuard)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'User role sucessfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  @ApiResponse({
    status: 409,
    description: 'User is not a member of the trip',
  })
  async updateMemberRole(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ): Promise<Member> {
    return this.tripMembersService.updateMemberRole(
      req.trip,
      updateMemberRoleDto,
    );
  }

  @HttpCode(204)
  @UseGuards(TripAdminGuard)
  @Delete(':email')
  @ApiResponse({
    status: 204,
    description: 'Member was deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'User has no privilege to delete a member in this trip',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips or Member dont exist',
  })
  @ApiResponse({
    status: 409,
    description: 'User is not a member of the trip',
  })
  remove(
    @Param('tripId') _tripId: string,
    @Param('email') email: string,
    @Request() req: AuthenticatedTripRequest,
  ): Promise<void> {
    return this.tripMembersService.removeMember(req.trip, email);
  }
}
