import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iPhone 13', description: 'The name of the product' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'A high-end smartphone', description: 'Product description' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1000, description: 'Price of the product' })
  price: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'd3a74394-ef7d-11eb-9a03-0242ac130003', description: 'The ID of the category to which this product belongs' })
  categoryId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'd3a74394-ef7d-11eb-9a03-0242ac130003', description: 'The ID of the market to which this product belongs' })
  marketId: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({ example: ['image1.png', 'image2.png'], description: 'List of product image file names' })
  photos: string[];
}
