import { Controller, Get, Post, Delete, Param, Body, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../common/utils/api-response';
import { RegisterDto } from '../auth/dto';
import { UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags("USERS")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() registerDto: RegisterDto) {
    const newUser = await this.usersService.createUser(registerDto);
    return successResponse(newUser, 'User created successfully');
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return successResponse(user, 'User fetched successfully');
  }

  @Roles(Role.ADMIN)
   @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return successResponse(users, 'All users fetched successfully');
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return successResponse(updatedUser, 'User updated successfully');
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return successResponse(null, 'User deleted successfully');
  }
}
