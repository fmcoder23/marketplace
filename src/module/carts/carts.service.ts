import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateCartItemDto, UpdateCartItemDto } from './dto';
import { ProductsService } from '../products';

@Injectable()
export class CartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  private async validateProductStock(productId: string, quantity: number) {
    const product = await this.productsService.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${product.name}. Only ${product.stock} left.`,
      );
    }
    return product;
  }

  private async findOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    return cart;
  }

  private async findCartItemOrThrow(cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return cartItem;
  }

  async create(userId: string, createCartItemDto: CreateCartItemDto) {
    const { productId, quantity } = createCartItemDto;

    const product = await this.validateProductStock(productId, quantity);
    const cart = await this.findOrCreateCart(userId);

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      return this.update(existingCartItem.id, { quantity: existingCartItem.quantity + quantity });
    }

    return this.prisma.cartItem.create({
      data: {
        productId,
        cartId: cart.id,
        quantity,
        price: product.price,
      },
      include: { product: true },
    });
  }

  async findMyCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, deletedAt: null },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async update(cartItemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.findCartItemOrThrow(cartItemId);

    if (quantity && quantity > 0) {
      await this.validateProductStock(cartItem.productId, quantity);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity || cartItem.quantity },
      include: { product: true },
    });
  }

  async remove(cartItemId: string) {
    await this.findCartItemOrThrow(cartItemId);

    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
