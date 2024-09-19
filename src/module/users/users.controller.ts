import { Controller, Get, Post, Delete, Param, Body, UseGuards, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { successResponse } from '../../common/utils/api-response';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@ApiTags("USERS")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.WAREHOUSE_MANAGER)
  @Get('me')
  async getMe(@Req() request: any) {
    const user = request.user as JwtPayload;
    const userProfile = await this.usersService.getUserById(user.id);
    return successResponse(userProfile, 'User profile fetched successfully');
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.USER, Role.WAREHOUSE_MANAGER)
  @Put('me')
  async updateMe(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = request.user as JwtPayload;
    const updatedUser = await this.usersService.updateUser(user.id, updateUserDto);
    return successResponse(updatedUser, 'User profile updated successfully');
  }

  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return successResponse(newUser, 'User created successfully');
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return successResponse(user, 'User found successfully');
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return successResponse(users, 'All users found successfully');
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
