import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaModule } from '@prisma';
import { ProductsModule } from '../products';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, JwtService, RolesGuard],
})
export class FavoritesModule {}
