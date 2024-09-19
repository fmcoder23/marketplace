import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "John Doe" })
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: "john@gmail.com" })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty({ example: "12345" })
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
