import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChecklistItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  assignee?: string | null;
}
