import { Request, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EPerfilService } from './e.perfil.service';
import {DiarioEmocionesDto, UpdateEPerfilDto } from './dto/perfil.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';

@ApiTags('perfil')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

@Controller('e.perfil')
export class EPerfilController {
  constructor(private readonly perfilService: EPerfilService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mi perfil', description: 'Devuelve el perfil completo del usuario autenticado.' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  findMy(@Request() req) {
    return this.perfilService.findByUser(req.user.id_usuario);
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar mi perfil', description: 'Actualiza datos del perfil: apodo, carrera, color del acompañante, etc.' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  update(@Body() dto: UpdateEPerfilDto, @Request() req) {
    return this.perfilService.update(req.user.id_usuario, dto);
  }

  @Get('pronostico')
  @ApiOperation({
    summary: 'Pronóstico de estrés del día ',
    description: 'Genera el pronóstico matutino de estrés basado en las tareas del día.',
  })
  @ApiResponse({
    status: 200,
    description: 'Pronóstico del día',
    schema: {
      example: {
        saludo: '¡Buenos días!',
        puntosEstresActual: 4,
        tareasParaHoy: 2,
        puntosEstresPronosticados: 5,
        avatar: { nivel: 'ALERTA', descripcion: 'Tu avatar está algo tenso', color: '#FFC107' },
        recomendacion: 'Día cargado. Considera usar el Modo Solo lo Urgente.',
        racha: 5,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  pronostico(@Request() req) {
    return this.perfilService.pronosticoEstres(req.user.id_usuario);
  }

  @Post('microdescanso')
  @ApiOperation({
    summary: 'Solicitar un microdescanso',
    description: 'Reduce 1 punto de estrés. Simula una respiración guiada de 1 minuto.',
  })
  @ApiResponse({
    status: 201,
    description: 'Microdescanso completado',
    schema: {
      example: {
        message: 'Microdescanso completado. Has bajado 1 punto de estrés. ¡Respira profundo!',
        puntosEstresActual: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  microdescanso(@Request() req) {
    return this.perfilService.microdescanso(req.user.id_usuario);
  }

  @Post('diario')
  @ApiOperation({
    summary: 'Registrar diario de emociones (opcional)',
    description: `Reflexión nocturna opcional. Pregunta:\n- ¿Cómo estuvo tu nivel de estrés hoy? (1-5)\n- ¿Qué te ayudó?\n- ¿Qué empeoró?\n\nAjusta los puntos de estrés según la escala reportada.`,
  })
  @ApiResponse({ status: 201, description: 'Diario registrado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  registrarDiario(@Body() dto: DiarioEmocionesDto, @Request() req) {
    return this.perfilService.registrarDiario(req.user.id_usuario, dto);
  }

  @Patch('racha')
  @ApiOperation({
    summary: 'Actualizar racha diaria',
    description: 'Suma +1 a la racha. Si alcanza 3, 7 o 15 días, otorga un bonus de -2 puntos de estrés.',
  })
  @ApiResponse({ status: 200, description: 'Racha actualizada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  actualizarRacha(@Request() req) {
    return this.perfilService.actualizarRacha(req.user.id_usuario);
  }
}
