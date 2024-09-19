import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "HOME"})
    title: string;
    
    @IsString()
    @IsOptional()
    @ApiProperty({example: "Yunusobod 22"})
    address: string;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: 69.101})
    longitude: number;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: 42.165})
    latitude: number;
}
