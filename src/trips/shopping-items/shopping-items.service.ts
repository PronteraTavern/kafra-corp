import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingItem } from './entities/shopping-item.entity';
import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { User } from '../../users/user.entity';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Injectable()
export class ShoppingItemsService {
  constructor(
    @InjectRepository(ShoppingItem)
    private shoppingItemsRepository: Repository<ShoppingItem>,
  ) {}

  async findAll(trip: Trip): Promise<ShoppingItem[]> {
    const items = this.shoppingItemsRepository.find({
      where: { trip },
      relations: ['suggestedBy'],
    });

    return items;
  }

  async findOne(id: string): Promise<ShoppingItem> {
    const item = await this.shoppingItemsRepository.findOne({
      where: { id },
      relations: ['suggestedBy'],
    });

    if (!item) {
      throw new NotFoundException('Shopping item not found');
    }

    return item;
  }

  async create(
    trip: Trip,
    user: User,
    createShoppingItemDto: CreateShoppingItemDto,
  ): Promise<ShoppingItem> {
    const item = this.shoppingItemsRepository.create({
      ...createShoppingItemDto,
      trip,
      suggestedBy: user,
    });

    const savedItem = await this.shoppingItemsRepository.save(item);

    return this.findOne(savedItem.id);
  }

  async update(
    id: string,
    updateShoppingItemDto: UpdateShoppingItemDto,
  ): Promise<ShoppingItem> {
    const itemToBeUpdated = await this.shoppingItemsRepository.findOneBy({
      id,
    });
    if (!itemToBeUpdated) {
      throw new NotFoundException('Shopping item not found');
    }

    Object.assign(itemToBeUpdated, updateShoppingItemDto);

    const updatedItem =
      await this.shoppingItemsRepository.save(itemToBeUpdated);
    return this.findOne(updatedItem.id);
  }

  async remove(id: string): Promise<void> {
    const itemToBeRemoved = await this.shoppingItemsRepository.findOneBy({
      id,
    });
    if (!itemToBeRemoved) {
      throw new NotFoundException('Shopping item not found');
    }

    const _result = await this.shoppingItemsRepository.remove(itemToBeRemoved);
    return;
  }
}
