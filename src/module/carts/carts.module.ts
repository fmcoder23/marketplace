import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';
import { ProductsModule } from '../products';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [CartsController],
  providers: [CartsService, JwtService, RolesGuard],
})
export class CartsModule { }
