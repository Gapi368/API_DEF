import { IsString, MaxLength, IsInt } from "class-validator";
import { ApiProperty } from "node_modules/@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateCmateriaDto {  @ApiProperty({ example: 'Cálculo Diferencial', description: 'Nombre de la materia' })
  @IsString()
  @MaxLength(45)
  nombre_materia: string = '';

  @ApiProperty({ example: 'Dr. Martínez', description: 'Nombre del docente' })
  @IsString()
  @MaxLength(45)
  maestro: string = '';

  @ApiProperty({ example: 1, description: 'ID del color para identificar la materia visualmente' })
  @IsInt()
  materia_color: number = 0;
}
