import { PartialType } from '@nestjs/swagger';
import { CreateGHobbyDto } from './create-g.hobby.dto';

export class UpdateGHobbyDto extends PartialType(CreateGHobbyDto) {}
