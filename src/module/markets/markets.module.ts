import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';

@Module({
  imports: [PrismaModule],
  controllers: [MarketsController],
  providers: [MarketsService, JwtService, RolesGuard],
  exports: [MarketsService]
})
export class MarketsModule {}
