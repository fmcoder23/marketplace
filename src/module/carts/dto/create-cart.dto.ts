import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'c3e97c8f-462b-4d29-a736-5d0b7228469f' })
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  quantity: number;
}
