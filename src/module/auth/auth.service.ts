import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { MailHelper, PasswordHasher } from '@common';
import { LoginDto, RegisterDto } from './dto';
import { generate } from 'otp-generator';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailHelper: MailHelper, 
  ) { }

  private generateOtp(): string {
    return generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await PasswordHasher.comparePassword(password, user.password))) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  }

  private generateToken(user: any) {
    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async sendOtpForRegister(registerDto: RegisterDto, role: Role) {
    const { email } = registerDto;
    const existingUser = await this.usersService.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const otp = this.generateOtp();

    await this.cacheManager.set(`otp:${email}`, {otp, registerDto, role}, 300000);

    const subject = 'Your OTP Code';
    const text = `Your OTP code is ${otp}`;
    const html = `Your <strong>OTP</strong> code is <strong>${otp}</strong>`;
    await this.mailHelper.sendMail(email, subject, text, html);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtpAndRegister(email: string, otp: string) {

    const cachedData = await this.cacheManager.get(`otp:${email}`);


    if (!cachedData) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const { otp: cachedOtp, registerDto, role } = cachedData as any;

    if (+cachedOtp !== +otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const hashedPassword = await PasswordHasher.hashPassword(registerDto.password);
    const newUser = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
      role,
    });

    const token = this.generateToken(newUser);

    await this.cacheManager.del(`otp:${email}`);

    return { message: 'Registration successful', user: newUser, token };
  }



  async login(loginDto: LoginDto, requiredRole?: Role) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new UnauthorizedException('Unauthorized role access');
    }

    const token = this.generateToken(user);
    return { message: 'Login successful', token };
  }

  async userLogin(loginDto: LoginDto) {
    return this.login(loginDto, Role.USER);
  }

  async adminLogin(loginDto: LoginDto) {
    return this.login(loginDto, Role.ADMIN);
  }

  async sellerLogin(loginDto: LoginDto) {
    return this.login(loginDto, Role.SELLER);
  }

  async warehouseManagerLogin(loginDto: LoginDto) {
    return this.login(loginDto, Role.WAREHOUSE_MANAGER);
  }
}
