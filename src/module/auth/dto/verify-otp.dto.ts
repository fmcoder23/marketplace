import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email address to verify OTP for' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP sent to the user\'s email' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
