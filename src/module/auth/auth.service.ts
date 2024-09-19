import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordHasher } from '@common';
import { LoginDto, RegisterDto } from './dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async register(registerDto: RegisterDto, role: Role = Role.USER) {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await PasswordHasher.hashPassword(registerDto.password);
    const newUser = await this.usersService.createUser({ 
      ...registerDto, 
      password: hashedPassword, 
      role 
    });

    const token = this.generateToken(newUser);
    return { message: 'Registration successful', user: newUser, token };
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

  async userRegister(registerDto: RegisterDto) {
    return this.register(registerDto, Role.USER);
  }

  async sellerRegister(registerDto: RegisterDto) {
    return this.register(registerDto, Role.SELLER);
  }
}
