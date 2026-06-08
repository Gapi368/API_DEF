import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { FTarea } from 'src/f.tareas/entities/f.tarea.entity';
import { GHobby } from 'src/g.hobbys/entities/g.hobby.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(EPerfil)
    private perfilRepo: Repository<EPerfil>,
    @InjectRepository(FTarea)
    private tareasRepo: Repository<FTarea>,
    @InjectRepository(Cmateria)
    private materiasRepo: Repository<Cmateria>,
    @InjectRepository(GHobby)
    private hobbysRepo: Repository<GHobby>,
  ) {}

  private calcularNivelAvatar(puntos: number) {
    if (puntos <= 3) return { nivel: 'SERENO', descripcion: 'Estás muy bien', color: '#4CAF50'};
    if (puntos <= 7) return { nivel: 'ALERTA', descripcion: 'Algo de tensión', color: '#FFC107'};
    if (puntos <= 12) return { nivel: 'ESTRESADO', descripcion: 'Nivel de estrés alto', color: '#FF9800'};
    return { nivel: 'CRÍTICO', descripcion: '¡Necesitas un descanso ya!', color: '#F44336' };
  }

  private calcularRecomendacion(puntos: number, tareasCompletadas: number, totalTareas: number): string {
    const pct = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;
    if (puntos >= 13) return 'Modo Solo lo Urgente activado. Enfócate en lo crítico y toma un microdescanso.';
    if (puntos >= 8) return 'Tu estrés está subiendo. Considera un microdescanso de 1 minuto.';
    if (pct >= 80) return '¡Vas muy bien! Casi terminas el día. ¡Sigue así!';
    if (pct >= 50) return 'Buen progreso. ¡A terminar las tareas pendientes!';
    return 'Empieza por las tareas de mayor dificultad mientras tienes energía.';
  }

  async getDashboard(userId: number): Promise<object> {
    const perfil = await this.perfilRepo.findOne({
      where: { id_perfil: userId },
      relations: { colorObj: true },
    });
    if (!perfil) throw new NotFoundException('Perfil no encontrado. Completa tu registro primero.');

    const hoy = new Date().toISOString().split('T')[0];

    // To-Do list (tareas pendientes)
    const tareasPendientes = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .andWhere('t.finalizada = false')
      .orderBy('t.puntos_estres', 'DESC')
      .addOrderBy('t.fecha', 'ASC')
      .getMany();

    //Tareas completadas hoy
    const tareasCompletadasHoy = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .andWhere('t.finalizada = true')
      .andWhere('t.fecha = :hoy', { hoy })
      .getCount();

    //Total de tareas del usuario
    const totalTareas = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .getCount();

    const tareasCompletadasTotal = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .andWhere('t.finalizada = true')
      .getCount();

    //materias del usuario
    const materias = await this.materiasRepo.find({
      where: { materia_usuario: userId },
      relations: { color: true },
    });

    //hobbies
    const hobbys = await this.hobbysRepo.find({
      where: { hobby_usuario: userId },
      select: { id_hobby: true, nombre_hobby: true },
    });

    const puntos = perfil.puntosT_estres || 0;
    const avatar = this.calcularNivelAvatar(puntos);
    const progresoPct = totalTareas > 0 ? Math.round((tareasCompletadasTotal / totalTareas) * 100) : 0;

    // Alerta si tiene tareas pendientes con alta prioridad)
    const tareasUrgentes = tareasPendientes.filter((t) => t.puntos_estres >= 5);
    const alertaInactividad =
      tareasUrgentes.length > 0
        ? `Tienes ${tareasUrgentes.length} tarea(s) urgente(s). ¿Necesitas un microdescanso antes de seguir?`
        : null;

    return {
      perfil: {
        apodo: perfil.apodo,
        racha: perfil.racha,
        puntosEstres: puntos,
        avatar,
        colorAcompanante: perfil.colorObj?.codigo_color || '#4A90D9',
      },
      todoList: tareasPendientes.map((t) => ({
        id_tarea: t.id_tarea,
        nombre_tarea: t.nombre_tarea,
        fecha: t.fecha,
        dificultad: t.dificultad,
        puntos_estres: t.puntos_estres,
        materia: t.materia?.nombre_materia,
        urgente: t.puntos_estres >= 5,
      })),
      progreso: {
        total: totalTareas,
        completadas: tareasCompletadasTotal,
        pendientes: tareasPendientes.length,
        completadasHoy: tareasCompletadasHoy,
        porcentaje: progresoPct,
      },
      materias: materias.map((m) => ({
        id_materia: m.id_materia,
        nombre_materia: m.nombre_materia,
        maestro: m.maestro,
        color: m.color?.codigo_color,
      })),
      hobbys,
      recomendacionDelDia: this.calcularRecomendacion(
        puntos,
        tareasCompletadasTotal,
        totalTareas,
      ),
      alertaInactividad,
      modoPanico: puntos >= 13 ? '🚨 MODO SOLO LO URGENTE: Enfócate solo en tareas con más de 4 puntos de estrés.' : null,
    };
  }

  async getResumenNocturno(userId: number): Promise<object> {
    const perfil = await this.perfilRepo.findOne({ where: { id_perfil: userId } });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');

    const hoy = new Date().toISOString().split('T')[0];

    const tareasHechasHoy = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .andWhere('t.finalizada = true')
      .andWhere('t.fecha = :hoy', { hoy })
      .getMany();

    const puntosGanados = tareasHechasHoy.reduce((s, t) => s + t.puntos_estres, 0);

    return {
      titulo: `Resumen de tu día, ${perfil.apodo}`,
      tareasHechasHoy: tareasHechasHoy.length,
      puntosDeEstresGanados: puntosGanados,
      puntosDeEstresActual: perfil.puntosT_estres || 0,
      rachaActual: perfil.racha || 0,
      mensaje:
        tareasHechasHoy.length > 0
          ? `Completaste ${tareasHechasHoy.length} tarea(s) hoy. ¡Buen trabajo!`
          : 'No completaste tareas hoy. Mañana es otra oportunidad.',
      recordatorio: '¿Un minuto para reflexionar? Registra tu diario en POST /perfil/diario',
    };
  }
}

