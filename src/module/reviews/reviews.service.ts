import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment, photos } = createReviewDto;

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        photos,
      },
    });

    await this.updateProductRating(productId);
    await this.updateMarketRating(product.marketId);

    return review;
  }

  async findAllByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, deletedAt: null },
      include: { user: true },
    });
  }

  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId, deletedAt: null },
      include: {
        product: true,
        user: true,
      },
    });
  }

  async update(reviewId: string, updateReviewDto: UpdateReviewDto) {
    const existingReview = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: updateReviewDto,
    });

    await this.updateProductRating(existingReview.productId);
    await this.updateMarketRating((await this.productsService.findOne(existingReview.productId)).marketId);

    return updatedReview;
  }

  async remove(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    await this.updateProductRating(review.productId);
    await this.updateMarketRating((await this.productsService.findOne(review.productId)).marketId);
  }

  private async updateProductRating(productId: string) {
    const { _avg: { rating } } = await this.prisma.review.aggregate({
      _avg: { rating: true },
      where: { productId, deletedAt: null },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating },
    });
  }

  private async updateMarketRating(marketId: string) {
    const { _avg: { rating } } = await this.prisma.product.aggregate({
      _avg: { rating: true },
      where: { marketId, deletedAt: null },
    });

    await this.prisma.market.update({
      where: { id: marketId },
      data: { rating },
    });
  }
}
