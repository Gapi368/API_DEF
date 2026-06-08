import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EPerfil } from './entities/e.perfil.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { FTarea } from 'src/f.tareas/entities/f.tarea.entity';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { DiarioEmocionesDto, UpdateEPerfilDto } from './dto/perfil.dto';



@Injectable()
export class EPerfilService {
  constructor(
    @InjectRepository(EPerfil)
    private perfilRepo: Repository<EPerfil>,
    @InjectRepository(FTarea)
    private tareasRepo: Repository<FTarea>,
    @InjectRepository(Cmateria)
    private materiasRepo: Repository<Cmateria>,
  ) {}

  async findByUser(userId: number): Promise<EPerfil> {
    const perfil = await this.perfilRepo.findOne({
      where: { id_perfil: userId },
      relations: { colorObj: true },
    });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    return perfil;
  }

  async update(userId: number, dto: UpdateEPerfilDto): Promise<EPerfil> {
    const perfil = await this.findByUser(userId);
    Object.assign(perfil, dto);
    return this.perfilRepo.save(perfil);
  }

  //Actualiza la racha del usuario (llamar diariamente)
  async actualizarRacha(userId: number): Promise<{ racha: number }> {
    const perfil = await this.findByUser(userId);
    perfil.racha = (perfil.racha || 0) + 1;
    //Bonus de estrés por rachas especiales
    if ([3, 7, 15].includes(perfil.racha)) {
      perfil.puntosT_estres = Math.max(0, (perfil.puntosT_estres || 0) - 2);
    }
    await this.perfilRepo.save(perfil);
    return { racha: perfil.racha };
  }

  //Microdescanso: resta 1 punto de estrés
  async microdescanso(userId: number): Promise<{ message: string; puntosEstresActual: number }> {
    const perfil = await this.findByUser(userId);
    perfil.puntosT_estres = Math.max(0, (perfil.puntosT_estres || 0) - 1);
    await this.perfilRepo.save(perfil);
    return {
      message: 'Microdescanso completado. Has bajado 1 punto de estrés. ¡Respira profundo!',
      puntosEstresActual: perfil.puntosT_estres,
    };
  }

  //Diario de emociones nocturno (opcional)
  async registrarDiario(userId: number, dto: DiarioEmocionesDto): Promise<object> {
    const perfil = await this.findByUser(userId);
    //Ajusta el estrés según la escala reportada
    const diferencia = dto.nivel_estres - 3; 
    perfil.puntosT_estres = Math.max(0, (perfil.puntosT_estres || 0) + diferencia);
    await this.perfilRepo.save(perfil);

    return {
      message: 'Diario registrado. ¡Gracias por reflexionar sobre tu día!',
      resumen: {
        nivel_estres_reportado: dto.nivel_estres,
        que_ayudo: dto.que_ayudo || 'No registrado',
        que_empeoro: dto.que_empeoro || 'No registrado',
        puntosEstresActual: perfil.puntosT_estres,
        racha: perfil.racha,
      },
    };
  }

  //Calcula el nivel de estrés del avatar 
  calcularNivelAvatar(puntos: number): { nivel: string; descripcion: string; color: string } {
    if (puntos <= 3) return { nivel: 'SERENO', descripcion: 'Tu avatar está relajado', color: '#4CAF50' };
    if (puntos <= 7) return { nivel: 'ALERTA', descripcion: 'Tu avatar está algo tenso', color: '#FFC107' };
    if (puntos <= 12) return { nivel: 'ESTRESADO', descripcion: 'Tu avatar está estresado', color: '#FF9800' };
    return { nivel: 'CRÍTICO', descripcion: 'Tu avatar está al límite. ¡Toma un descanso!', color: '#F44336' };
  }

  //Pronóstico de estrés matutino
  async pronosticoEstres(userId: number): Promise<object> {
    const perfil = await this.findByUser(userId);
    const hoy = new Date().toISOString().split('T')[0];

    const tareasHoy = await this.tareasRepo
      .createQueryBuilder('t')
      .innerJoin('t.materia', 'm')
      .where('m.materia_usuario = :userId', { userId })
      .andWhere('t.fecha = :hoy', { hoy })
      .andWhere('t.finalizada = false')
      .getMany();

    const puntosPronosticados = tareasHoy.reduce((sum, t) => sum + t.puntos_estres, 0);
    const avatar = this.calcularNivelAvatar((perfil.puntosT_estres || 0) + puntosPronosticados);

    return {
      saludo: `¡Buenos días, ${perfil.apodo}! `,
      puntosEstresActual: perfil.puntosT_estres,
      tareasParaHoy: tareasHoy.length,
      puntosEstresPronosticados: puntosPronosticados,
      avatar,
      recomendacion: puntosPronosticados > 6
        ? 'Día cargado. Considera usar el Modo Solo lo Urgente.'
        : 'El día se ve manejable. ¡Tú puedes!',
      racha: perfil.racha,
    };
  }
}
