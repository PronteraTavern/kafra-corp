import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  skip: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number;
}
