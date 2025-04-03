import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { Member } from './members/entities/members.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { MembersService } from './members/members.service';
import { MembersController } from './members/members.controller';
import { Trip } from './entities/trip.entity';
import { ChecklistController } from './checklist/checklist.controller';
import { CheckListService } from './checklist/checklist.service';
import { ChecklistItem } from './checklist/entities/checklist-item.entity';
import { ShoppingItem } from './shopping-items/entities/shopping-item.entity';
import { ShoppingItemsService } from './shopping-items/shopping-items.service';
import { ShoppingItemsController } from './shopping-items/shopping-items.controller';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Trip, Member, ChecklistItem, ShoppingItem]),
  ],
  controllers: [
    TripsController,
    MembersController,
    ChecklistController,
    ShoppingItemsController,
  ],
  providers: [
    TripsService,
    MembersService,
    CheckListService,
    ShoppingItemsService,
  ],
})
export class TripsModule {}
