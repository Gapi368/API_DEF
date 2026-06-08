import { PartialType } from '@nestjs/mapped-types';
import { CreateBUserDto } from './create-b.user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional,IsString, MaxLength, MinLength, IsEmail } from 'class-validator';

export class UpdateBUserDto {
  @ApiPropertyOptional({ example: 'Juan García', description: 'Nombre completo' })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nombre?: string;

  @ApiPropertyOptional({ example: 'juangarcia', description: 'Nuevo username' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  username?: string;

  @ApiPropertyOptional({ example: 'nuevo@uni.edu.mx', description: 'Nuevo correo' })
  @IsOptional()
  @IsEmail()
  @MaxLength(45)
  correo?: string;

  @ApiPropertyOptional({ example: 'NuevoPass123!', description: 'Nueva contraseña' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password?: string;
}

