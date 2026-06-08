import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCmateriaDto } from './create-cmateria.dto';

import { IsString, MaxLength , IsOptional, IsInt} from 'class-validator';

export class UpdateCmateriaDto {
  @ApiPropertyOptional({ example: 'Cálculo Integral' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nombre_materia?: string;

  @ApiPropertyOptional({ example: 'Dra. López' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  maestro?: string;

  @ApiPropertyOptional({ example: 2, description: 'ID del color para la materia' })
  @IsOptional()
  @IsInt()
  materia_color?: number;
}
