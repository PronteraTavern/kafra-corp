import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  // @IsDate()
  start_date: Date;
  // @IsDate()
  end_date: Date;
}
