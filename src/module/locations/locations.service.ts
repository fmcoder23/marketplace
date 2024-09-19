import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  create(createLocationDto: CreateLocationDto) {
    return 'This action adds a new location';
  }

  findAll() {
    return `This action returns all locations`;
  }

  findMyLocations() {
    return `This action returns all locations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} location`;
  }

  update(id: string, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: string) {
    return `This action removes a #${id} location`;
  }
}
