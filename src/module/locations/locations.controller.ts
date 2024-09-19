import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Req } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtPayload, successResponse } from '@common';
import { Request } from 'express';

@ApiTags('LOCATIONS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(Role.USER)
  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto, 
    @Req() request: Request // Use Request with globally extended type
  ) {
    const user = request.user as JwtPayload; // Safely cast to JwtPayload
    const data = await this.locationsService.create(createLocationDto, user.id);
    return successResponse(data, 'Location created successfully');
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    const data = await this.locationsService.findAll();
    return successResponse(data, 'All locations retrieved successfully');
  }

  @Roles(Role.USER)
  @Get('me')
  async findMyLocations(@Req() request: Request) {
    const user = request.user as JwtPayload;
    const data = await this.locationsService.findMyLocations(user.id);
    return successResponse(data, "Your locations retrieved successfully");
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.locationsService.findOne(id);
    return successResponse(data, 'Location retrieved successfully');
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    const data = await this.locationsService.update(id, updateLocationDto);
    return successResponse(data, 'Location updated successfully');
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.locationsService.remove(id);
    return successResponse(null, 'Location deleted successfully');
  }
}
