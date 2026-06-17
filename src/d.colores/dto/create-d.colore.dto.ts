import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "node_modules/@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateDColoreDto {
  @ApiProperty({ example: 'Azul', description: 'Nombre del color' })
  @IsString()
  @MaxLength(45)
  nombre_color?: string;

  @ApiProperty({ example: '#4A90D9', description: 'Código hexadecimal del color' })
  @IsString()
  @MaxLength(60)
  codigo_color?: string;
}

