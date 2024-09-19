import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WaybillsService } from './waybills.service';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { UpdateWaybillDto } from './dto/update-waybill.dto';

@Controller('waybills')
export class WaybillsController {
  constructor(private readonly waybillsService: WaybillsService) {}

  @Post()
  create(@Body() createWaybillDto: CreateWaybillDto) {
    return this.waybillsService.create(createWaybillDto);
  }

  @Get()
  findAll() {
    return this.waybillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waybillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaybillDto: UpdateWaybillDto) {
    return this.waybillsService.update(+id, updateWaybillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waybillsService.remove(+id);
  }
}
