import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  @ApiPropertyOptional({ example: 'SHIPPED', description: 'Updated order status' })
  status?: OrderStatus;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: [
      { productId: 'd3a74394-ef7d-11eb-9a03-0242ac130003', quantity: 2 },
      { productId: 'b3a74394-ef7d-11eb-9a03-0242ac130002', quantity: 1 },
    ],
    description: 'Updated array of products in the order',
  })
  items?: { productId: string; quantity: number }[];
}
