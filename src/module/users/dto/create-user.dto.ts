import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: "John Doe"})
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({example: "john@gmail.com"})
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: "12345"})
  password: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiPropertyOptional({example: Role.SELLER})
  role?: Role;
}
