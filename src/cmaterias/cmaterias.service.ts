import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCmateriaDto } from './dto/create-cmateria.dto';
import { UpdateCmateriaDto } from './dto/update-cmateria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cmateria } from './entities/cmateria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CmateriasService {
  constructor(
    @InjectRepository(Cmateria)
    private materiasRepo: Repository<Cmateria>,
  ) { }

async create(dto: CreateCmateriaDto, userId: number): Promise<Cmateria> {
  console.log('Creando materia para userId:', userId, 'dto:', dto);
  const materia = this.materiasRepo.create({
    nombre_materia: dto.nombre_materia,
    maestro: dto.maestro,
    materia_usuario: userId,
    materia_color: dto.materia_color,
  });
  return this.materiasRepo.save(materia);
}

  async findAllByUser(userId: number): Promise<Cmateria[]> {
    return this.materiasRepo.find({
      where: { materia_usuario: userId },
      relations: { color: true },
    });
  }

  async findOne(id: number, userId: number): Promise<Cmateria> {
    const materia = await this.materiasRepo.findOne({
      where: { id_materia: id },
      relations: { color: true, tareas: true },
    });
    if (!materia) throw new NotFoundException('Materia no encontrada');
    if (materia.materia_usuario !== userId) throw new ForbiddenException('Sin acceso a esta materia');
    return materia;
  }

  async update(id: number, dto: UpdateCmateriaDto, userId: number): Promise<Cmateria> {
    const materia = await this.findOne(id, userId);
    Object.assign(materia, dto);
    return this.materiasRepo.save(materia);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const materia = await this.findOne(id, userId);
    await this.materiasRepo.remove(materia);
    return { message: `Materia "${materia.nombre_materia}" eliminada` };
  }
}
