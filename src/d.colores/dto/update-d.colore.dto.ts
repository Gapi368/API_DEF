import { PartialType } from '@nestjs/swagger';
import { CreateDColoreDto } from './create-d.colore.dto';

export class UpdateDColoreDto extends PartialType(CreateDColoreDto) {}
