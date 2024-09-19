import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { RegisterDto } from '../auth/dto';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user;
  }

  async createUser(registerDto: RegisterDto) {
    const user = await this.findOneByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException("Email already exists");
    }
    return await this.prismaService.user.create({
      data: { ...registerDto }
    });
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    return await this.prismaService.user.findMany();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.getUserById(id);
    return await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
