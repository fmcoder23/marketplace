import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateStockDto {
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({example: 2})
    stock: number;
}