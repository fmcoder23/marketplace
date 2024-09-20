import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsInt, Min, Max, IsString, IsOptional } from "class-validator";

export class CreateReviewDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({ example: 'c9a3c5b4-8f44-11eb-8dcd-0242ac130003' })
    productId: string;
  
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty({ example: 4, description: 'Rating between 1 and 5' })
    rating: number;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Great product!' })
    comment?: string;
  
    @IsOptional()
    @ApiProperty({ type: [String], example: ['photo1.jpg', 'photo2.jpg'] })
    photos?: string[];
  }