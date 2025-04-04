import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShoppingItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;
}
