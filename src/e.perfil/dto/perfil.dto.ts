import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Max, Min, IsOptional, MaxLength, IsString } from "class-validator";


export class UpdateEPerfilDto {
    @ApiPropertyOptional({ example: 'Juan', description: 'Nombre' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    nombreC_nombre?: string;

    @ApiPropertyOptional({ example: 'Pérez García', description: 'Apellidos' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    nombreC_apellidos?: string;

    @ApiPropertyOptional({ example: 21, description: 'Edad' })
    @IsOptional()
    @IsInt()
    @Min(15)
    @Max(70)
    edad?: number;

    @ApiPropertyOptional({ example: 'Ingeniería en Sistemas', description: 'Carrera' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    carrera?: string;

    @ApiPropertyOptional({ example: '6to', description: 'Semestre actual' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    semestre_cursandose?: string;

    @ApiPropertyOptional({ example: 'Juanito', description: 'Apodo favorito' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    apodo?: string;

    @ApiPropertyOptional({ example: 2, description: 'ID del color del acompañante' })
    @IsOptional()
    @IsInt()
    color_acompanante?: number;
}

export class DiarioEmocionesDto {
    @ApiProperty({
        example: 3,
        description: 'Nivel de estrés hoy (escala 1-5)',
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    nivel_estres: number = 3;

    @ApiPropertyOptional({
        example: 'Completé mis tareas pendientes',
        description: '¿Qué te ayudó hoy?',
    })
    @IsOptional()
    @IsString()
    que_ayudo?: string;

    @ApiPropertyOptional({
        example: 'El examen sorpresa de cálculo',
        description: '¿Qué empeoró tu día?',
    })
    @IsOptional()
    @IsString()
    que_empeoro?: string;
}

