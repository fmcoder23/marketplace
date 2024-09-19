import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';
import { MarketsModule } from '../markets';

@Module({
  imports: [PrismaModule, MarketsModule],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService, RolesGuard],
})
export class ProductsModule {}
