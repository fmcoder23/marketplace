import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { WaybillStatus } from '@prisma/client';

export class UpdateWaybillDto {
  @IsEnum(WaybillStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: WaybillStatus })
  status?: WaybillStatus;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2024-10-05T12:00:00Z' })
  acceptedDate?: string;
}
