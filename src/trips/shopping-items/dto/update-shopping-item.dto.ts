import { PartialType } from '@nestjs/swagger';
import { CreateChecklistItemDto } from '../../checklist/dto/create-checklist-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateShoppingItemDto extends PartialType(CreateChecklistItemDto) {
  @IsBoolean()
  @IsOptional()
  bought?: boolean;
}
