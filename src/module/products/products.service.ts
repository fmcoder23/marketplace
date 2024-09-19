import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateProductDto, UpdateProductDto } from './dto';
import { MarketsService } from '../markets';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly marketsService: MarketsService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        market: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findMyProducts(userId: string) {
    const markets = await this.marketsService.findMyMarkets(userId);
    const marketIds = markets.map(market => market.id);

    return this.prisma.product.findMany({
      where: {
        marketId: { in: marketIds },
        deletedAt: null,
      },
      include: {
        category: true,
        market: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        market: true,
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException('Product not found or has been deleted');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
