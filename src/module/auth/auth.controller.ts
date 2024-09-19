import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async userRegister(@Body() registerDto: RegisterDto) {
    return this.authService.userRegister(registerDto);
  }

  @Post('seller/register')
  async sellerRegister(@Body() registerDto: RegisterDto) {
    return this.authService.sellerRegister(registerDto);
  }

  @Post('login')
  async userLogin(@Body() loginDto: LoginDto) {
    return this.authService.userLogin(loginDto);
  }

  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('seller/login')
  async sellerLogin(@Body() loginDto: LoginDto) {
    return this.authService.sellerLogin(loginDto);
  }
}
