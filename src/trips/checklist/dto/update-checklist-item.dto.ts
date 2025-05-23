import { PartialType } from '@nestjs/swagger';
import { CreateChecklistItemDto } from './create-checklist-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChecklistItemDto extends PartialType(
  CreateChecklistItemDto,
) {
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
