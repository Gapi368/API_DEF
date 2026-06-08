import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CmateriasService } from './cmaterias.service';
import { CreateCmateriaDto } from './dto/create-cmateria.dto';
import { UpdateCmateriaDto } from './dto/update-cmateria.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';


@ApiTags('materias')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cmaterias')
export class CmateriasController {
  constructor(private readonly materiasService: CmateriasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar materia', description: 'Agrega una materia al usuario. Asigna un color para identificarla en el dashboard.' })
  @ApiResponse({ status: 201, description: 'Materia registrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  create(@Body() dto: CreateCmateriaDto, @Request() req) {
    return this.materiasService.create(dto, req.user.id_usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Mis materias', description: 'Lista todas las materias del usuario con su color asociado.' })
  @ApiResponse({ status: 200, description: 'Lista de materias' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Request() req) {
    return this.materiasService.findAllByUser(req.user.id_usuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener materia con sus tareas' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Materia encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin acceso' })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.materiasService.findOne(id, req.user.id_usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar materia' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Materia actualizada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCmateriaDto,
    @Request() req,
  ) {
    return this.materiasService.update(id, dto, req.user.id_usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar materia' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Materia eliminada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.materiasService.remove(id, req.user.id_usuario);
  }
}