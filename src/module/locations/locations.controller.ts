import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('LOCATIONS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Roles(Role.USER)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Roles(Role.USER)
  @Get('me')
  findMyLocations() {
    return this.locationsService.findMyLocations();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}
