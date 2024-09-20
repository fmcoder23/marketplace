import { Module } from '@nestjs/common';
import { WaybillsService } from './waybills.service';
import { WaybillsController } from './waybills.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';
import { ProductsModule } from '../products';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [WaybillsController],
  providers: [WaybillsService, JwtService, RolesGuard],
})
export class WaybillsModule {}
