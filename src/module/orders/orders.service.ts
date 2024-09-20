import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { OrderStatus } from "@prisma/client";
import { ProductsService } from "../products";
import { CreateOrderDto, UpdateOrderDto } from "./dto";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  private async handleStock(productId: string, quantity: number, reduce: boolean = true) {
    const product = await this.productsService.findOne(productId);
    const updatedStock = reduce
      ? product.stock - quantity
      : product.stock + quantity;

    if (updatedStock < 0) {
      throw new BadRequestException(
        `Insufficient stock for product ${product.name}. Only ${product.stock} left.`,
      );
    }

    await this.productsService.updateStock(productId, updatedStock);
    return product;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items } = createOrderDto;

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await this.handleStock(item.productId, item.quantity, true);
      const itemPrice = product.price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += itemPrice;

      await this.productsService.updateOrderCount(item.productId, true);
    }

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        orderedItems: {
          create: orderItems,
        },
      },
      include: {
        orderedItems: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderedItems: true,
        user: true,
      },
    });

    if (!order || order.deletedAt) {
      throw new NotFoundException('Order not found or has been deleted');
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      where: { deletedAt: null },
      include: {
        orderedItems: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId, deletedAt: null },
      include: {
        orderedItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    const { items, status } = updateOrderDto;
    const updatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await this.handleStock(item.productId, item.quantity, true);
      const itemPrice = product.price * item.quantity;

      updatedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += itemPrice;
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status,
        totalPrice: totalPrice > 0 ? totalPrice : undefined,
        orderedItems: {
          deleteMany: {},
          create: updatedItems,
        },
      },
      include: {
        orderedItems: true,
      },
    });
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.findOne(id);

    if (order.userId !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this order');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order can only be cancelled if it is still pending');
    }

    for (const orderItem of order.orderedItems) {
      await this.handleStock(orderItem.productId, orderItem.quantity, false);

      await this.productsService.updateOrderCount(orderItem.productId, false);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
