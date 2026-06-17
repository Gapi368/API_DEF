import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'juanperez', description: 'Nombre de usuario' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'MiPass123!', description: 'Contraseña' })
  @IsString()
  password!: string;
}
