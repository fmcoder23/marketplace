import { Injectable } from '@nestjs/common';
import { CreateWaybillDto } from './dto/create-waybill.dto';
import { UpdateWaybillDto } from './dto/update-waybill.dto';

@Injectable()
export class WaybillsService {
  create(createWaybillDto: CreateWaybillDto) {
    return 'This action adds a new waybill';
  }

  findAll() {
    return `This action returns all waybills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waybill`;
  }

  update(id: number, updateWaybillDto: UpdateWaybillDto) {
    return `This action updates a #${id} waybill`;
  }

  remove(id: number) {
    return `This action removes a #${id} waybill`;
  }
}
