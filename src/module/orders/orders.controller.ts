import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { RolesGuard, Roles, successResponse } from '@common';

@ApiTags('ORDERS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.USER)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @Req() request: Request) {
    const user = request.user;
    const data = await this.ordersService.create(createOrderDto, user.id);
    return successResponse(data, 'Order created successfully');
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  async findAll() {
    const data = await this.ordersService.findAll();
    return successResponse(data, 'All orders retrieved successfully');
  }

  @Roles(Role.USER)
  @Get('me')
  @ApiOperation({ summary: 'Retrieve the current user\'s orders' })
  async findMyOrders(@Req() request: Request) {
    const userId = request.user.id;
    const data = await this.ordersService.findMyOrders(userId);
    return successResponse(data, 'Your orders retrieved successfully');
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific order by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.ordersService.findOne(id);
    return successResponse(data, 'Order retrieved successfully');
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update an order by ID (admin only)' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const data = await this.ordersService.update(id, updateOrderDto);
    return successResponse(data, 'Order updated successfully by admin');
  }

  @Roles(Role.USER)
  @Delete('cancel/:id')
  @ApiOperation({ summary: 'Cancel an order by ID (user only)' })
  async cancelOrder(@Param('id') id: string, @Req() request: Request) {
    const user = request.user;
    await this.ordersService.cancelOrder(id, user.id);
    return successResponse(null, 'Order cancelled successfully');
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID (admin only)' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return successResponse(null, 'Order deleted successfully');
  }
}
