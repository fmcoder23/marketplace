import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomException } from '../../common/exceptions/custom-exception';
import { successResponse } from 'src/common/utils/api-response';
import { RegisterDto } from '../auth/dto';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user;
  }

  async createUser(registerDto: RegisterDto) {
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
