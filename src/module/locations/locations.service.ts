import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateLocationDto, UpdateLocationDto } from './dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLocationDto: CreateLocationDto, userId: string) {
    return this.prisma.location.create({
      data: {
        ...createLocationDto,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.location.findMany({
      where: { deletedAt: null },
      include: {
        user: true,
      },
    });
  }

  async findMyLocations(userId: string) {
    return this.prisma.location.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!location || location.deletedAt) {
      throw new NotFoundException('Location not found or has been deleted');
    }

    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id);
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.location.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
