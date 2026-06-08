import { Request, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FTareasService } from './f.tareas.service';
import { CreateFTareaDto } from './dto/create-f.tarea.dto';
import { UpdateFTareaDto } from './dto/update-f.tarea.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';

@ApiTags('tareas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

@Controller('f.tareas')
export class FTareasController {
  constructor(private readonly tareasService: FTareasService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar nueva tarea',
    description: `Registra una tarea y suma automáticamente los puntos de estrés al perfil.\n\n**Fórmula:** dificultad + prioridad = puntos de estrés\n\nEjemplo: dificultad alta (3) + prioridad alta (3) = 6 puntos`,
  })
  @ApiResponse({
    status: 201,
    description: 'Tarea registrada. Puntos de estrés actualizados automáticamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'La materia no te pertenece' })
  @ApiResponse({ status: 404, description: 'Materia no encontrada' })
  create(@Body() dto: CreateFTareaDto, @Request() req) {
    return this.tareasService.create(dto, req.user.id_usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis tareas', description: 'Todas las tareas del usuario autenticado, ordenadas por fecha.' })
  @ApiResponse({ status: 200, description: 'Lista de tareas' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Request() req) {
    return this.tareasService.findAllByUser(req.user.id_usuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarea encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin acceso a esta tarea' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tareasService.findOne(id, req.user.id_usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarea', description: 'Si marcas `finalizada: true`, se restan los puntos de estrés del perfil.' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarea actualizada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFTareaDto,
    @Request() req,
  ) {
    return this.tareasService.update(id, dto, req.user.id_usuario);
  }

  @Patch(':id/completar')
  @ApiOperation({
    summary: 'Marcar tarea como completada',
    description: '✅ Completa la tarea y resta sus puntos de estrés del perfil automáticamente.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarea completada. Estrés reducido.' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  completar(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tareasService.completar(id, req.user.id_usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tareasService.remove(id, req.user.id_usuario);
  }
}
