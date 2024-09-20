import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateWaybillDto, UpdateDateDto, UpdateWaybillDto } from './dto';
import { ProductsService } from '../products';
import { WaybillStatus } from '@prisma/client';

@Injectable()
export class WaybillsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createWaybillDto: CreateWaybillDto, sellerId: string) {
    const { items, scheduledDate } = createWaybillDto;

    const waybillItems = await Promise.all(items.map(async (item) => {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
      };
    }));

    return this.prisma.waybill.create({
      data: {
        sellerId,
        scheduledDate: new Date(scheduledDate),
        status: WaybillStatus.PENDING,
        items: {
          create: waybillItems,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAll() {
    return this.prisma.waybill.findMany({
      include: {
        items: true,
        seller: true,
      },
    });
  }

  async findMyWaybills(sellerId: string) {
    return this.prisma.waybill.findMany({
      where: { sellerId, deletedAt: null },
      include: {
        items: true,
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const waybill = await this.prisma.waybill.findUnique({
      where: { id },
      include: {
        items: true,
        seller: true,
      },
    });

    if (!waybill) {
      throw new NotFoundException('Waybill not found');
    }

    return waybill;
  }

  async updateForAdmin(id: string, updateWaybillDto: UpdateWaybillDto) {
    const waybill = await this.findOne(id);

    if (waybill.status === WaybillStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled waybill');
    }

    return this.prisma.waybill.update({
      where: { id },
      data: {
        ...updateWaybillDto,
        acceptedDate: updateWaybillDto.acceptedDate ? new Date(updateWaybillDto.acceptedDate) : undefined,
      },
      include: {
        items: true,
      },
    });
  }

  async updateScheduledDateForSeller(id: string, scheduledDate: UpdateDateDto) {
    const waybill = await this.findOne(id);

    if (waybill.status !== WaybillStatus.PENDING) {
      throw new BadRequestException('Scheduled date can only be updated for pending waybills');
    }

    return this.prisma.waybill.update({
      where: { id },
      data: {
        scheduledDate: new Date(scheduledDate.scheduledDate),
      },
    });
  }

  async acceptWaybill(id: string) {
    const waybill = await this.findOne(id);

    if (waybill.status !== WaybillStatus.PENDING) {
      throw new BadRequestException('Only pending waybills can be accepted');
    }

    for (const item of waybill.items) {
      const product = await this.productsService.findOne(item.productId);
      if (product) {
        await this.productsService.updateStock(product.id, product.stock + item.quantity);
      }
    }

    return this.prisma.waybill.update({
      where: { id },
      data: { status: WaybillStatus.ACCEPTED },
      include: {
        items: true,
      },
    });
  }

  async remove(id: string) {
    const waybill = await this.findOne(id);

    if (waybill.status === WaybillStatus.CANCELLED) {
      throw new BadRequestException('Waybill is already cancelled');
    }

    return this.prisma.waybill.update({
      where: { id },
      data: { status: WaybillStatus.CANCELLED },
    });
  }
}
