import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FilterProductDto, UpdateProductDto, UpdateStockDto } from './dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RolesGuard, Roles, successResponse } from '@common';
import { Request } from 'express';

@ApiTags('PRODUCTS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN, Role.SELLER)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);
    return successResponse(data, 'Product created successfully');
  }

  @Roles(Role.USER, Role.SELLER, Role.ADMIN, Role.WAREHOUSE_MANAGER)
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'marketId', required: false })
  @ApiQuery({ name: 'sortBy', enum: ['price', 'rating', 'orderCount'], required: false })
  @ApiQuery({ name: 'sortDirection', enum: ['asc', 'desc'], required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  async findAll(@Query() filterDto: FilterProductDto, @Req() request: Request) {
    const user = request.user;
    const data = await this.productsService.findAll(user.id, filterDto);
    return successResponse(data, 'Products retrieved successfully');
  }

  @Roles(Role.SELLER)
  @Get('me')
  async findMyProducts(@Req() request: Request) {
    const user = request.user;
    const data = await this.productsService.findMyProducts(user.id);
    return successResponse(data, "Current seller's products retrieved successfully");
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return successResponse(data, 'Product retrieved successfully');
  }

  @Roles(Role.ADMIN, Role.SELLER)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productsService.update(id, updateProductDto);
    return successResponse(data, 'Product updated successfully');
  }

  @Roles(Role.ADMIN, Role.WAREHOUSE_MANAGER)
  @Put('stock/:id')
  async updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    const data = await this.productsService.updateStock(id, updateStockDto.stock);
    return successResponse(data, 'Product Stock updated successfully');
  }

  @Roles(Role.ADMIN, Role.SELLER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return successResponse(null, 'Product deleted successfully');
  }
}
