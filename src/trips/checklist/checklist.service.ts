import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChecklistItem } from './entities/checklist-item.entity';
import { Trip } from '../entities/trip.entity';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CheckListService {
  constructor(
    @InjectRepository(ChecklistItem)
    private checklistRespository: Repository<ChecklistItem>,
  ) {}

  async findAll(trip: Trip): Promise<ChecklistItem[]> {
    return this.checklistRespository.find({
      where: {
        trip: { id: trip.id },
      },
      relations: ['assignee'],
    });
  }

  async findOne(id: string): Promise<ChecklistItem> {
    const item = await this.checklistRespository.findOne({
      where: { id },
      relations: ['assignee'],
    });
    if (!item) {
      throw new NotFoundException();
    }
    return item;
  }

  async create(
    trip: Trip,
    createChecklistItemDto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    if (!createChecklistItemDto.assignee) {
      createChecklistItemDto.assignee = null;
    }
    const checkListItem = this.checklistRespository.create({
      name: createChecklistItemDto.name,
      trip,
      assignee: createChecklistItemDto.assignee
        ? { id: createChecklistItemDto.assignee }
        : undefined, // Ensures compatibility with TypeORM
    });

    const savedItem = await this.checklistRespository.save(checkListItem);
    return this.findOne(savedItem.id);
  }

  async update(
    id: string,
    updateChecklistItemDto: UpdateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const itemToBeUpdated = await this.checklistRespository.findOneBy({ id });
    if (!itemToBeUpdated) {
      throw new NotFoundException('Checklist item not found');
    }

    Object.assign(itemToBeUpdated, updateChecklistItemDto);

    const updatedItem = await this.checklistRespository.save(itemToBeUpdated);
    return this.findOne(updatedItem.id);
  }

  async remove(id: string): Promise<void> {
    const itemToBeRemoved = await this.checklistRespository.findOneBy({ id });
    if (!itemToBeRemoved) {
      throw new NotFoundException('Checklist item not found');
    }

    const _result = await this.checklistRespository.remove(itemToBeRemoved);
    return;
  }
}
