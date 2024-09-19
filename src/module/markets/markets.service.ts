import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateMarketDto, UpdateMarketDto } from './dto';

@Injectable()
export class MarketsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findMarketByName(name: string) {
    return this.prisma.market.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async createForAdmin({ description, logo, name, userId }: CreateMarketDto) {
    await this.ensureMarketNameIsUnique(name);
    return this.prisma.market.create({
      data: {
        name,
        description,
        logo,
        sellerId: userId,
      },
    });
  }

  async createForSeller({ description, logo, name }: CreateMarketDto, userId: string) {
    await this.ensureMarketNameIsUnique(name);
    return this.prisma.market.create({
      data: {
        name,
        description,
        logo,
        sellerId: userId,
      },
    });
  }

  private async ensureMarketNameIsUnique(name: string) {
    const market = await this.findMarketByName(name);
    if (market) {
      throw new BadRequestException('Market with the same name already exists');
    }
  }

  async findAll() {
    return this.prisma.market.findMany({
      where: { deletedAt: null },
      include: {
        seller: true, 
      },
    });
  }

  async findMyMarkets(userId: string) {
    return this.prisma.market.findMany({
      where: {
        sellerId: userId,
        deletedAt: null,
      },
      include: {
        products: true,
      }
    });
  }

  async findOne(id: string) {
    const market = await this.prisma.market.findUnique({
      where: { id },
    });
    if (!market || market.deletedAt) {
      throw new NotFoundException('Market not found');
    }
    return market;
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    await this.findOne(id);
    return this.prisma.market.update({
      where: { id },
      data: updateMarketDto,
    });
  }

  async remove(id: string) {
    const market = await this.findOne(id);
    if (!market) {
      throw new NotFoundException('Market not found');
    }
    return this.prisma.market.update({
      where: { id },
      data: { deletedAt: new Date() }, 
    });
  }
}
