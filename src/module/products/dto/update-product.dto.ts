import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'iPhone 13', description: 'Updated product name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'An updated product description', description: 'Updated product description' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 1200, description: 'Updated product price' })
  price?: number;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: 'd3a74394-ef7d-11eb-9a03-0242ac130003', description: 'Updated category ID' })
  categoryId?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: 'd3a74394-ef7d-11eb-9a03-0242ac130003', description: 'Updated market ID' })
  marketId?: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['newimage1.png', 'newimage2.png'], description: 'Updated list of product image file names' })
  photos?: string[];
}
