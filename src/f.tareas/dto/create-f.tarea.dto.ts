import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, Max, Min, IsString, MaxLength, IsInt } from "class-validator";


export class CreateFTareaDto {
  @ApiProperty({ example: 'Proyecto Final', description: 'Nombre de la tarea' })
  @IsString()
  @MaxLength(45)
  nombre_tarea: string = '';

  @ApiProperty({
    example: 3,
    description: 'Dificultad de la tarea: 1 (baja), 2 (media), 3 (alta)',
    minimum: 1,
    maximum: 3,
  })
  @IsInt()
  @Min(1)
  @Max(3)
  dificultad: number = 1;

  @ApiProperty({
    example: 2,
    description: 'Prioridad de la tarea: 1 (baja), 2 (media), 3 (alta)',
    minimum: 1,
    maximum: 3,
  })
  @IsInt()
  @Min(1)
  @Max(3)
  prioridad: number = 1;

  @ApiProperty({ example: 1, description: 'ID de la materia relacionada' })
  @IsInt()
  tarea_materia: number = 0;

  @ApiProperty({ example: '2025-12-15', description: 'Fecha de entrega (YYYY-MM-DD)' })
  @IsDateString()
  fecha: string = '';
}
