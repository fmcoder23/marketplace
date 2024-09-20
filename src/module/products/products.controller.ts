import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

  @Get()
  async findAll() {
    const data = await this.productsService.findAll();
    return successResponse(data, 'All products retrieved successfully');
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
