import { PartialType } from '@nestjs/swagger';
import { CreateRopaDto } from './create-ropa.dto';

export class UpdateRopaDto extends PartialType(CreateRopaDto) {}
