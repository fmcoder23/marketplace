import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaModule } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@common';

@Module({
  imports: [PrismaModule],
  controllers: [LocationsController],
  providers: [LocationsService, JwtService, RolesGuard],
})
export class LocationsModule {}
