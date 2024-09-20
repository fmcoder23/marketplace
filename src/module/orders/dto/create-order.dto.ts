import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [
      { productId: 'd3a74394-ef7d-11eb-9a03-0242ac130003', quantity: 2 },
      { productId: 'b3a74394-ef7d-11eb-9a03-0242ac130002', quantity: 1 },
    ],
    description: 'Array of products in the order with quantities',
  })
  items: { productId: string; quantity: number }[];
}
