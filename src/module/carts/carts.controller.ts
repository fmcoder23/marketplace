import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles, RolesGuard, successResponse } from '@common';
import { Role } from '@prisma/client';

@ApiTags('CARTS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Roles(Role.USER)
  @Post('items')
  async addToCart(@Body() createCartItemDto: CreateCartItemDto, @Req() request: any) {
    const userId = request.user.id;
    const data = await this.cartsService.create(userId, createCartItemDto);
    return successResponse(data, 'Item added to cart successfully');
  }

  @Roles(Role.USER)
  @Get('me')
  async getMyCart(@Req() request: any) {
    const userId = request.user.id;
    const data = await this.cartsService.findMyCart(userId);
    return successResponse(data, 'Your cart retrieved successfully');
  }

  @Roles(Role.USER)
  @Put('items/:id')
  async updateCartItem(
    @Param('id') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const data = await this.cartsService.update(cartItemId, updateCartItemDto);
    return successResponse(data, 'Cart item updated successfully');
  }
  @Roles(Role.USER)
  @Delete('items/:id')
  async removeCartItem(@Param('id') cartItemId: string) {
    await this.cartsService.remove(cartItemId);
    return successResponse(null, 'Cart item removed successfully');
  }

  @Roles(Role.USER)
  @Delete('clear')
  async clearMyCart(@Req() request: any) {
    const userId = request.user.id;
    await this.cartsService.clearCart(userId);
    return successResponse(null, 'Cart cleared successfully');
  }
}
