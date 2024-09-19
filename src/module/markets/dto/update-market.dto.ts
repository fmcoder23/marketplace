import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMarketDto {

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({example: "Uzum Market"})
    name?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({example: "Description about Uzum Market"})
    description?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({example: "logo.png"})
    logo?: string;
    
}
