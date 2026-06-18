import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFTareaDto } from './dto/create-f.tarea.dto';
import { UpdateFTareaDto } from './dto/update-f.tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FTarea } from './entities/f.tarea.entity';
import { Repository } from 'typeorm';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';

@Injectable()
export class FTareasService {
  constructor(
    @InjectRepository(FTarea)
    private tareasRepo: Repository<FTarea>,
    @InjectRepository(Cmateria)
    private materiasRepo: Repository<Cmateria>,
    @InjectRepository(EPerfil)
    private perfilRepo: Repository<EPerfil>,
  ) {}

  //Calcula los puntos de estrés: dificultad + prioridad 
  private calcularPuntosEstres(dificultad: number, prioridad: number): number {
    return dificultad + prioridad;
  }

  async create(dto: CreateFTareaDto, userId: number): Promise<FTarea> {
    //Valida que la materia pertenezca al usuario
    const materia = await this.materiasRepo.findOne({
      where: { id_materia: dto.tarea_materia },
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');
    if (materia.materia_usuario !== userId) {
      throw new ForbiddenException('No tienes acceso a esta materia');
    }

    const puntos = this.calcularPuntosEstres(dto.dificultad, dto.prioridad);

    const tarea = this.tareasRepo.create({
      nombre_tarea: dto.nombre_tarea,
      dificultad: dto.dificultad,
      prioridad: dto.prioridad,
      puntos_estres: puntos,
      tarea_materia: dto.tarea_materia,
      fecha: dto.fecha,
      finalizada: false,
      fecha_completada: null,
    });
    const saved = await this.tareasRepo.save(tarea);

    // Sumar puntos de estrés al perfil
    await this.actualizarEstres(userId, puntos);

    return saved;
  }

  async findAllByUser(userId: number): Promise<FTarea[]> {
    return this.tareasRepo
      .createQueryBuilder('tarea')
      .innerJoin('tarea.materia', 'materia')
      .where('materia.materia_usuario = :userId', { userId })
      .orderBy('tarea.fecha', 'ASC')
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<FTarea> {
    const tarea = await this.tareasRepo.findOne({
      where: { id_tarea: id },
      relations: { materia: true },
    });
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    if (tarea.materia.materia_usuario !== userId) {
      throw new ForbiddenException('No tienes acceso a esta tarea');
    }
    return tarea;
  }

  async update(id: number, dto: UpdateFTareaDto, userId: number): Promise<FTarea> {
    const tarea = await this.findOne(id, userId);
    const yaFinalizada = tarea.finalizada;
    //Puntos antes de aplicar cualquier cambio (se usan para revertir el estrés si corresponde)
    const puntosOriginales = tarea.puntos_estres;

    //Si cambia dificultad y/o prioridad, se recalculan los puntos de estrés de la tarea
    const nuevaDificultad = dto.dificultad ?? tarea.dificultad;
    const nuevaPrioridad = dto.prioridad ?? tarea.prioridad;
    const puntosRecalculados = this.calcularPuntosEstres(nuevaDificultad, nuevaPrioridad);

    Object.assign(tarea, dto);
    tarea.puntos_estres = puntosRecalculados;

    //Si se marcó como finalizada ahora, se restan los puntos de estrés (ya recalculados) y se guarda la fecha
    if (!yaFinalizada && dto.finalizada === true) {
      tarea.fecha_completada = new Date().toISOString().split('T')[0];
      await this.actualizarEstres(userId, -puntosRecalculados);
    }

    //Si se reabre una tarea ya finalizada, se le devuelven los puntos que se habían restado
    if (yaFinalizada && dto.finalizada === false) {
      tarea.fecha_completada = null;
      await this.actualizarEstres(userId, puntosOriginales);
    }

    return this.tareasRepo.save(tarea);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const tarea = await this.findOne(id, userId);
    const puntos = tarea.puntos_estres;
    const nombre = tarea.nombre_tarea;
    if (!tarea.finalizada) {
      //Reverte los puntos si la tarea no estaba finalizada
      await this.actualizarEstres(userId, -puntos);
    }
    await this.tareasRepo.remove(tarea);
    return { message: `Tarea "${nombre}" eliminada` };
  }

  async completar(id: number, userId: number): Promise<{ message: string; puntosRestados: number }> {
    const tarea = await this.findOne(id, userId);
    if (tarea.finalizada) {
      return { message: 'La tarea ya estaba completada', puntosRestados: 0 };
    }
    const puntos = tarea.puntos_estres;
    tarea.finalizada = true;
    tarea.fecha_completada = new Date().toISOString().split('T')[0];
    await this.tareasRepo.save(tarea);
    await this.actualizarEstres(userId, -puntos);
    return {
      message: `¡Tarea "${tarea.nombre_tarea}" completada! -${puntos} puntos de estrés`,
      puntosRestados: puntos,
    };
  }

  private async actualizarEstres(userId: number, delta: number): Promise<void> {
    const perfil = await this.perfilRepo.findOne({ where: { id_perfil: userId } });
    if (perfil) {
      perfil.puntosT_estres = Math.max(0, (perfil.puntosT_estres || 0) + delta);
      await this.perfilRepo.save(perfil);
    }
  }
}
