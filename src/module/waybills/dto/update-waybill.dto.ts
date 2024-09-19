import { PartialType } from '@nestjs/swagger';
import { CreateWaybillDto } from './create-waybill.dto';

export class UpdateWaybillDto extends PartialType(CreateWaybillDto) {}
