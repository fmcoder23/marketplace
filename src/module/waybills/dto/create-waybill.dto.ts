import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateWaybillItemDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'a29b4e67-f32b-4b44-8f5b-6d7e34a41ff8' })
  productId: string;

  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  quantity: number;
}

export class CreateWaybillDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWaybillItemDto)
  @ApiProperty({ type: [CreateWaybillItemDto] })
  items: CreateWaybillItemDto[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-10-01T12:00:00Z' })
  scheduledDate: string;
}
