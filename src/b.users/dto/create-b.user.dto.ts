import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';


export class CreateBUserDto {
@ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsString()
  @MaxLength(45)
  nombre?: string;

  @ApiProperty({ example: 'juanperez', description: 'Nombre de usuario único' })
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  username: string= '';

  @ApiProperty({ example: 'juan@uni.edu.mx', description: 'Correo electrónico único' })
  @IsEmail()
  @MaxLength(45)
  correo: string= '';

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string= '';
}


