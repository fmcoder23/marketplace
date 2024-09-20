import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles, RolesGuard, successResponse } from '@common';
import { Role } from '@prisma/client';
import { Request } from 'express';

@ApiTags('CARTS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Roles(Role.USER)
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  async addToCart(@Body() createCartItemDto: CreateCartItemDto, @Req() request: Request) {
    const userId = request.user.id;
    const data = await this.cartsService.create(userId, createCartItemDto);
    return successResponse(data, 'Item added to cart successfully');
  }

  @Roles(Role.USER)
  @Get('me')
  @ApiOperation({ summary: 'Retrieve the current user\'s cart' })
  async getMyCart(@Req() request: Request) {
    const userId = request.user.id;
    const data = await this.cartsService.findMyCart(userId);
    return successResponse(data, 'Your cart retrieved successfully');
  }

  @Roles(Role.USER)
  @Put('items/:id')
  @ApiOperation({ summary: 'Update a cart item' })
  async updateCartItem(
    @Param('id') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const data = await this.cartsService.update(cartItemId, updateCartItemDto);
    return successResponse(data, 'Cart item updated successfully');
  }

  @Roles(Role.USER)
  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  async removeCartItem(@Param('id') cartItemId: string) {
    await this.cartsService.remove(cartItemId);
    return successResponse(null, 'Cart item removed successfully');
  }

  @Roles(Role.USER)
  @Delete('clear')
  @ApiOperation({ summary: 'Clear all items from the cart' })
  async clearMyCart(@Req() request: Request) {
    const userId = request.user.id;
    await this.cartsService.clearCart(userId);
    return successResponse(null, 'Cart cleared successfully');
  }
}
