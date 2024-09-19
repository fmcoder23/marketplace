import { Module } from '@nestjs/common';
import { WaybillsService } from './waybills.service';
import { WaybillsController } from './waybills.controller';

@Module({
  controllers: [WaybillsController],
  providers: [WaybillsService],
})
export class WaybillsModule {}
