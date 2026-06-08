import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "node_modules/@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateGHobbyDto {
    @ApiProperty({ example: 'Música', description: 'Nombre del hobby' })
    @IsString()
    @MaxLength(45)
    nombre_hobby?: string;
}
