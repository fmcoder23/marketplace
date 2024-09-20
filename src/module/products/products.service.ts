import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { MarketsService } from "../markets";
import { CreateProductDto, FilterProductDto, UpdateProductDto } from "./dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly marketsService: MarketsService) {}

  async updateStock(productId: string, newStock: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  }

  async updateOrderCount(productId: string, increment: boolean) {
    const product = await this.findOne(productId);
    const updatedOrderCount = increment ? (product.orderCount || 0) + 1 : (product.orderCount || 0) - 1;
    await this.prisma.product.update({
      where: { id: productId },
      data: { orderCount: updatedOrderCount < 0 ? 0 : updatedOrderCount },
    });
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(userId: string, filterDto: FilterProductDto) {
    const {
      search,
      minPrice,
      maxPrice,
      minRating,
      categoryId,
      marketId,
      sortBy = 'name',
      sortDirection = 'asc',
      page = 1,
      pageSize = 10,
    } = filterDto;

    const skip = (page - 1) * pageSize;

    const products = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          minPrice ? { price: { gte: minPrice } } : {},
          maxPrice ? { price: { lte: maxPrice } } : {},
          minRating ? { rating: { gte: minRating } } : {},
          categoryId ? { categoryId } : {},
          marketId ? { marketId } : {},
        ],
      },
      orderBy: {
        [sortBy]: sortDirection,
      },
      skip,
      take: pageSize,
      include: {
        favorites: {
          where: { userId },
        },
      },
    });

    const totalCount = await this.prisma.product.count({
      where: {
        deletedAt: null,
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          minPrice ? { price: { gte: minPrice } } : {},
          maxPrice ? { price: { lte: maxPrice } } : {},
          minRating ? { rating: { gte: minRating } } : {},
          categoryId ? { categoryId } : {},
          marketId ? { marketId } : {},
        ],
      },
    });

    const productsWithFavorite = products.map((product) => ({
      ...product,
      isFavorite: product.favorites.length > 0,
    }));

    return { data: productsWithFavorite, totalCount, page, pageSize };
  }

  async findMyProducts(userId: string) {
    const markets = await this.marketsService.findMyMarkets(userId);
    const marketIds = markets.map((market) => market.id);

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
