import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMarketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Uzum Market' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Description about Uzum Market' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'logo.png' })
  logo: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Seller ID (only for admins)' })
  userId?: string;
}
