import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard'; 
import { Roles } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../utils/api-response';
import { RegisterDto } from '../auth/dto';
import { UpdateUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("USERS")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') 
  @Post()
  async createUser(@Body() registerDto: RegisterDto) {
    const newUser = await this.usersService.createUser(registerDto);
    return successResponse(newUser, 'User created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return successResponse(user, 'User fetched successfully');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')  // Only admin users can get all users
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return successResponse(users, 'All users fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return successResponse(updatedUser, 'User updated successfully');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return successResponse(null, 'User deleted successfully');
  }
}
