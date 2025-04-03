import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShoppingItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
