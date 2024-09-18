import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
