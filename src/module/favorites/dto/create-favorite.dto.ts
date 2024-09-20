import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @IsUUID()
  @ApiProperty({ example: '8b3e3b36-0b3f-4d7a-b3e6-89b17f3bf7cd' })
  productId: string;
}
