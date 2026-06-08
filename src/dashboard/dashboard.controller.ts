import { Controller, Get, UseGuards, Request} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Dashboard principal',
    description: `El corazón de EstresApp. Devuelve:\n\n- **To-Do List**: tareas pendientes ordenadas por urgencia\n- **Gráfico de progreso**: porcentaje de tareas completadas\n- **Nivel de estrés + Avatar**: estado actual del acompañante\n- **Racha actual**\n- **Recomendación del día**\n- **Alerta de inactividad**: si hay tareas urgentes sin atender\n- **Modo Pánico**: si el estrés supera 13 puntos`,
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard completo',
    schema: {
      example: {
        perfil: {
          apodo: 'Juanito',
          racha: 5,
          puntosEstres: 8,
          avatar: { nivel: 'ESTRESADO', descripcion: 'Nivel de estrés alto', color: '#FF9800' },
          colorAcompanante: '#4A90D9',
        },
        todoList: [
          { id_tarea: 1, nombre_tarea: 'Proyecto Final', fecha: '2025-12-15', dificultad: 3, puntos_estres: 6, materia: 'Cálculo', urgente: true },
        ],
        progreso: { total: 10, completadas: 6, pendientes: 4, completadasHoy: 2, porcentaje: 60 },
        materias: [{ id_materia: 1, nombre_materia: 'Cálculo', maestro: 'Dr. Martínez', color: '#FF5733' }],
        hobbys: [{ id_hobby: 1, nombre_hobby: 'Música' }],
        recomendacionDelDia: 'Buen progreso. ¡A terminar las tareas pendientes!',
        alertaInactividad: 'Tienes 1 tarea(s) urgente(s). ¿Necesitas un microdescanso antes de seguir?',
        modoPanico: null,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboard(req.user.id_usuario);
  }

  @Get('resumen-nocturno')
  @ApiOperation({
    summary: 'Resumen nocturno',
    description: 'Resumen del día: tareas completadas, puntos de estrés ganados/perdidos y racha. Aparece en la noche como recordatorio de reflexión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen del día',
    schema: {
      example: {
        titulo: 'Resumen de tu día, Juanito',
        tareasHechasHoy: 3,
        puntosDeEstresGanados: 9,
        puntosDeEstresActual: 4,
        rachaActual: 5,
        mensaje: 'Completaste 3 tarea(s) hoy. ¡Buen trabajo!',
        recordatorio: '¿Un minuto para reflexionar? Registra tu diario en POST /perfil/diario',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  getResumenNocturno(@Request() req) {
    return this.dashboardService.getResumenNocturno(req.user.id_usuario);
  }
}

