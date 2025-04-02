import {
  Controller,
  Param,
  UseGuards,
  Request,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TripGuard } from '../common/guards/trip-guard';
import { Member } from '../members/entities/members.entity';
import { AuthenticatedTripRequest } from '../common/interfaces/authenticated-trip-request.interface';
import { CheckListService } from './checklist.service';
import { ChecklistItem } from './entities/checklist-item.entity';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TripGuard, Member)
@Controller('trips/:tripId/checklist')
export class ChecklistController {
  constructor(private checklistService: CheckListService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Items successfully fetched',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  async findAll(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
  ): Promise<ChecklistItem[]> {
    return this.checklistService.findAll(req.trip);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Checklist Item succesfully created',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  async create(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
    @Body() createChecklistItemDto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    return this.checklistService.create(req.trip, createChecklistItemDto);
  }

  @Patch(':itemId')
  @ApiResponse({
    status: 200,
    description: 'Checklist Item succesfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips or Item doesnt exist',
  })
  async update(
    @Param('tripId') _tripId: string,
    @Param('itemId') itemId: string,
    @Body() updateChecklistItemDto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    return this.checklistService.update(itemId, updateChecklistItemDto);
  }

  @HttpCode(204)
  @Delete(':itemId')
  @ApiResponse({
    status: 204,
    description: 'Checklist item  was deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips or Item dont exist',
  })
  async remove(
    @Param('tripId') _tripId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.checklistService.remove(itemId);
  }
}
