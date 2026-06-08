import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGHobbyDto } from './dto/create-g.hobby.dto';
import { UpdateGHobbyDto } from './dto/update-g.hobby.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GHobby } from './entities/g.hobby.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GHobbysService {
  constructor(
    @InjectRepository(GHobby)
    private hobbysRepo: Repository<GHobby>,
  ) {}

  async create(dto: CreateGHobbyDto, userId: number): Promise<GHobby> {
    const hobby = this.hobbysRepo.create({
      nombre_hobby: dto.nombre_hobby,
      hobby_usuario: userId,
    });
    return this.hobbysRepo.save(hobby);
  }

  async findAllByUser(userId: number): Promise<GHobby[]> {
    return this.hobbysRepo.find({ where: { hobby_usuario: userId } });
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const hobby = await this.hobbysRepo.findOne({ where: { id_hobby: id } });
    if (!hobby) throw new NotFoundException('Hobby no encontrado');
    if (hobby.hobby_usuario !== userId) throw new ForbiddenException('No tienes acceso a este hobby');
    await this.hobbysRepo.remove(hobby);
    return { message: `Hobby "${hobby.nombre_hobby}" eliminado` };
  }
}
