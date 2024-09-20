import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto, RegisterDto, VerifyOtpDto } from './dto';
import { Role } from '@prisma/client';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register as a User' })
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.authService.sendOtpForRegister(registerDto, Role.USER);
  }

  @Post('seller/register')
  @ApiOperation({ summary: 'Register as a Seller' })
  async sellerRegister(@Body() registerDto: RegisterDto) {
    return this.authService.sendOtpForRegister(registerDto, Role.SELLER);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and complete registration' })
  @ApiBody({ type: VerifyOtpDto }) 
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    return this.authService.verifyOtpAndRegister(email, otp);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin Login' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('seller/login')
  @ApiOperation({ summary: 'Seller Login' })
  async sellerLogin(@Body() loginDto: LoginDto) {
    return this.authService.sellerLogin(loginDto);
  }

  @Post('warehouse-manager/login')
  @ApiOperation({ summary: 'Warehouse Manager Login' })
  async warehouseManagerLogin(@Body() loginDto: LoginDto) {
    return this.authService.warehouseManagerLogin(loginDto);
  }
}
