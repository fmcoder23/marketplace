import { Controller, Post, Body, Param, Delete, Get, UseGuards, Req, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard, Roles, successResponse } from '@common';
import { Role } from '@prisma/client';

@ApiTags('REVIEWS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.USER)
  @Post()
  async create(@Req() request: any, @Body() createReviewDto: CreateReviewDto) {
    const userId = request.user.id;
    const data = await this.reviewsService.create(userId, createReviewDto);
    return successResponse(data, 'Review created successfully');
  }

  @Roles(Role.USER)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    const data = await this.reviewsService.update(id, updateReviewDto);
    return successResponse(data, 'Review updated successfully');
  }

  @Roles(Role.USER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return successResponse(null, 'Review deleted successfully');
  }

  @Roles(Role.USER)
  @Get('me')
  async findMyReviews(@Req() request: any) {
    const userId = request.user.id;
    const data = await this.reviewsService.findMyReviews(userId);
    return successResponse(data, 'Your reviews retrieved successfully');
  }
}
