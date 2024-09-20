import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { WaybillsService } from './waybills.service';
import { CreateWaybillDto, UpdateDateDto, UpdateWaybillDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles, RolesGuard, successResponse } from '@common';
import { Role } from '@prisma/client';
import { Request } from 'express';

@ApiTags('WAYBILLS')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('waybills')
export class WaybillsController {
  constructor(private readonly waybillsService: WaybillsService) {}

  @Roles(Role.SELLER)
  @Post()
  @ApiOperation({ summary: 'Create a new waybill (seller only)' })
  async create(@Body() createWaybillDto: CreateWaybillDto, @Req() request: Request) {
    const seller = request.user;
    const data = await this.waybillsService.create(createWaybillDto, seller.id);
    return successResponse(data, 'Waybill created successfully');
  }

  @Roles(Role.WAREHOUSE_MANAGER, Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Retrieve all waybills (warehouse manager or admin)' })
  async findAll() {
    const data = await this.waybillsService.findAll();
    return successResponse(data, 'Waybills retrieved successfully');
  }

  @Roles(Role.SELLER)
  @Get('me')
  @ApiOperation({ summary: 'Retrieve the current seller\'s waybills' })
  async findMyWaybills(@Req() request: Request) {
    const sellerId = request.user.id;
    const data = await this.waybillsService.findMyWaybills(sellerId);
    return successResponse(data, 'Your waybills retrieved successfully');
  }

  @Roles(Role.SELLER, Role.WAREHOUSE_MANAGER, Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific waybill by ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.waybillsService.findOne(id);
    return successResponse(data, 'Waybill retrieved successfully');
  }

  @Roles(Role.SELLER)
  @Put(':id/scheduled-date')
  @ApiOperation({ summary: 'Update the scheduled date for a waybill (seller only)' })
  async updateScheduledDate(
    @Param('id') id: string,
    @Body() scheduledDate: UpdateDateDto,
  ) {
    const data = await this.waybillsService.updateScheduledDateForSeller(id, scheduledDate);
    return successResponse(data, 'Scheduled date updated successfully');
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a waybill by ID (admin only)' })
  async updateForAdmin(@Param('id') id: string, @Body() updateWaybillDto: UpdateWaybillDto) {
    const data = await this.waybillsService.updateForAdmin(id, updateWaybillDto);
    return successResponse(data, 'Waybill updated successfully');
  }

  @Roles(Role.WAREHOUSE_MANAGER, Role.ADMIN)
  @Put(':id/accept')
  @ApiOperation({ summary: 'Accept a waybill (warehouse manager or admin)' })
  async acceptWaybill(@Param('id') id: string) {
    const data = await this.waybillsService.acceptWaybill(id);
    return successResponse(data, 'Waybill accepted successfully');
  }

  @Roles(Role.SELLER, Role.WAREHOUSE_MANAGER, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a waybill by ID (seller, warehouse manager, or admin)' })
  async remove(@Param('id') id: string) {
    await this.waybillsService.remove(id);
    return successResponse(null, 'Waybill cancelled successfully');
  }
}
