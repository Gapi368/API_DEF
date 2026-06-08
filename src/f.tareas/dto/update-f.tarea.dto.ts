import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateFTareaDto  {
  @ApiPropertyOptional({ example: 'Proyecto Actualizado' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nombre_tarea?: string;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  dificultad?: number;

  @ApiPropertyOptional({ example: '2025-12-20' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Marcar tarea como finalizada (resta puntos de estrés)',
  })
  @IsOptional()
  @IsBoolean()
  finalizada?: boolean;
}

