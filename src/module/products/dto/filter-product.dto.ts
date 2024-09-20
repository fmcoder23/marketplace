import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for name or description' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Minimum price' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @ApiPropertyOptional({ description: 'Maximum price' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Minimum rating' })
  minRating?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Category ID to filter by category' })
  categoryId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Market ID to filter by market' })
  marketId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Sort by field (price, rating, orderCount)' })
  sortBy?: 'price' | 'rating' | 'orderCount';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Sort direction (asc or desc)' })
  sortDirection?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiPropertyOptional({ description: 'Page size for pagination', default: 10 })
  pageSize?: number;
}
