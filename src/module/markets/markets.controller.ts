import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CreateMarketDto, UpdateMarketDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { successResponse } from 'src/common/utils/api-response';

@ApiTags('MARKETS')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Roles(Role.ADMIN)
  @Post('admin')
  async createForAdmin(@Body() createMarketDto: CreateMarketDto) {
    const data = await this.marketsService.createForAdmin(createMarketDto);
    return successResponse(data, 'Market created successfully');
  }

  @Roles(Role.SELLER)
  @Post('seller')
  async createForSeller(@Body() createMarketDto: CreateMarketDto, @Req() request: any) {
    const userId = request.user.id;
    const data = await this.marketsService.createForSeller(createMarketDto, userId);
    return successResponse(data, 'Market created successfully');
  }

  @Get()
  async findAll() {
    const data = await this.marketsService.findAll();
    return successResponse(data, 'All markets retrieved successfully');
  }

  @Roles(Role.SELLER)
  @Get('me')
  async findMyMarkets(@Req() request: any) {
    const userId = request.user.id;
    const data = await this.marketsService.findMyMarkets(userId);
    return successResponse(data, 'Your markets retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.marketsService.findOne(id);
    return successResponse(data, 'Market retrieved successfully');
  }

  @Roles(Role.ADMIN, Role.SELLER)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    const data = await this.marketsService.update(id, updateMarketDto);
    return successResponse(data, 'Market updated successfully');
  }

  @Roles(Role.ADMIN, Role.SELLER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.marketsService.remove(id);
    return successResponse(null, 'Market deleted successfully');
  }
}
