import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles, RolesGuard, successResponse } from '@common';

@ApiTags('CATEGORIES')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoriesService.create(createCategoryDto);
    return successResponse(data, 'Category created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  async findAll() {
    const data = await this.categoriesService.findAll();
    return successResponse(data, 'All categories retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by its ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    return successResponse(data, 'Category retrieved successfully');
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing category' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await this.categoriesService.update(id, updateCategoryDto);
    return successResponse(data, 'Category updated successfully');
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by its ID' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return successResponse(null, 'Category deleted successfully');
  }
}
