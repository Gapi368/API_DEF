import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";


export class RegisterDto {
  @ApiProperty({ example: 'Alondra Pinales', description: 'Nombre completo' })
  @IsString()
  @MaxLength(45)
  nombre!: string;

  @ApiProperty({ example: 'alondrap', description: 'Nombre de usuario único' })
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  username!: string;

  @ApiProperty({ example: 'alondra@uni.edu.mx', description: 'Correo electrónico' })
  @IsEmail()
  @MaxLength(45)
  correo?: string;

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password!: string;

  @ApiProperty({ example: 20, description: 'Edad del estudiante' })
  @IsInt()
  @Min(15)
  @Max(70)
  edad?: number;

  @ApiProperty({
    example: 'Ingeniería en Sistemas',
    description: 'Carrera universitaria',
  })
  @IsString()
  @MaxLength(45)
  carrera?: string;

  @ApiProperty({ example: '5to', description: 'Semestre que cursa actualmente' })
  @IsString()
  @MaxLength(45)
  semestre?: string;

  @ApiProperty({ example: 'Alondra', description: 'Apodo o nombre favorito' })
  @IsString()
  @MaxLength(45)
  apodo?: string;

  @ApiProperty({
    example: ['Música', 'Videojuegos'],
    description: 'Lista de hobbies del usuario',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hobbys?: string[];
}
