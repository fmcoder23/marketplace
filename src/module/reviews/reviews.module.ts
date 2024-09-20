import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';
import { ProductsModule } from '../products';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtService, RolesGuard],
})
export class ReviewsModule {}
