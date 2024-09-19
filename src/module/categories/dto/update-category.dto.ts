import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Updated Electronics', description: 'Updated category name' })
  name?: string;
}
