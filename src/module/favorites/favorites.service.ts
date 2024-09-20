import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService, private readonly productsService: ProductsService) { }

  async toggleFavorite(createFavoriteDto: CreateFavoriteDto, userId: string) {
    const { productId } = createFavoriteDto;

    await this.productsService.findOne(productId);

    const existingFavorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingFavorite) {
      await this.prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return { message: 'Product removed from favorites' };
    } else {
      await this.prisma.favorite.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: true,
        },
      });
      return { message: 'Product added to favorites' };
    }
  }

  async findMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }
}
