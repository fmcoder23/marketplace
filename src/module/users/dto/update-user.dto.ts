import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({example: "John Doe"})
  fullname?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({example: "john@gmail.com"})
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({example: "12345"})
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiPropertyOptional({example: Role.SELLER})
  role?: Role;
}
