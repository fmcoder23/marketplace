import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaModule } from '@prisma';

@Module({
  imports: [PrismaModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
