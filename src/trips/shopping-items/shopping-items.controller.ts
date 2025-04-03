import {
  UseGuards,
  Controller,
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TripGuard } from '../common/guards/trip-guard';
import { Member } from '../members/entities/members.entity';
import { ShoppingItemsService } from './shopping-items.service';
import { AuthenticatedTripRequest } from '../common/interfaces/authenticated-trip-request.interface';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { ShoppingItem } from './entities/shopping-item.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TripGuard, Member)
@Controller('trips/:tripId/shoppingItems')
export class ShoppingItemsController {
  constructor(private shoppingItemsService: ShoppingItemsService) {}

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
  ): Promise<ShoppingItem[]> {
    return this.shoppingItemsService.findAll(req.trip);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Shopping Item succesfully created',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips doesnt exist',
  })
  async create(
    @Param('tripId') _tripId: string,
    @Request() req: AuthenticatedTripRequest,
    @Body() createShoppingItemDto: CreateShoppingItemDto,
  ): Promise<ShoppingItem> {
    return this.shoppingItemsService.create(
      req.trip,
      req.user,
      createShoppingItemDto,
    );
  }

  @Patch(':itemId')
  @ApiResponse({
    status: 200,
    description: 'Shopping Item succesfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips or Item doesnt exist',
  })
  async update(
    @Param('tripId') _tripId: string,
    @Param('itemId') itemId: string,
    @Body() updateShoppingItemDto: UpdateShoppingItemDto,
  ): Promise<ShoppingItem> {
    return this.shoppingItemsService.update(itemId, updateShoppingItemDto);
  }

  @HttpCode(204)
  @Delete(':itemId')
  @ApiResponse({
    status: 204,
    description: 'Shopping item  was deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Trips or Item dont exist',
  })
  async remove(
    @Param('tripId') _tripId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.shoppingItemsService.remove(itemId);
  }
}
