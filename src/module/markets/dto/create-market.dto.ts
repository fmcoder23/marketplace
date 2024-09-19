import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMarketDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "Uzum Market"})
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "Description about Uzum Market"})
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: "logo.png"})
    logo: string;

}
