import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DColoresService } from './d.colores.service';
import { CreateDColoreDto } from './dto/create-d.colore.dto';
import { UpdateDColoreDto } from './dto/update-d.colore.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';
import { RolesGuard } from 'src/comun/guards/roles.guard';
import { Roles } from 'src/comun/decoradores/roles.decoradores';
import { Rol } from 'src/comun/enum/rol.enum';



@ApiTags('colores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('d.colores')
export class DColoresController {
  constructor(private readonly coloresService: DColoresService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todos los colores disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de colores' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll() {
    return this.coloresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener color por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Color encontrado' })
  @ApiResponse({ status: 404, description: 'Color no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coloresService.findOne(id);
  }

  @Post()
  @Roles(Rol.DEVELOPER, Rol.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo color (solo DEVELOPER/ADMIN)' })
  @ApiResponse({ status: 201, description: 'Color creado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(@Body() dto: CreateDColoreDto) {
    return this.coloresService.create(dto);
  }
}
