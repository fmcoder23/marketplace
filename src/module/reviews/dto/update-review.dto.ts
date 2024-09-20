import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min, Max, IsOptional, IsString } from "class-validator";

export class UpdateReviewDto {
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    @ApiProperty({ example: 4 })
    rating?: number;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Great product!' })
    comment?: string;
  
    @IsOptional()
    @ApiProperty({ type: [String], example: ['photo1.jpg', 'photo2.jpg'] })
    photos?: string[];
  }