import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsDateString()
  start_date: Date;
  @IsDateString()
  end_date: Date;
}
