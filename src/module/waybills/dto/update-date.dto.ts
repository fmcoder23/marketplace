import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class UpdateDateDto {
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2024-10-01T12:00:00Z' })
    scheduledDate: string;
}