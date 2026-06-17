import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDColoreDto } from './dto/create-d.colore.dto';
import { UpdateDColoreDto } from './dto/update-d.colore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DColor } from './entities/d.colore.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DColoresService {
  constructor(
    @InjectRepository(DColor)
    private coloresRepo: Repository<DColor>,
  ) {}

  async findAll(): Promise<DColor[]> {
    return this.coloresRepo.find();
  }

  async findOne(id: number): Promise<DColor> {
    const color = await this.coloresRepo.findOne({ where: { id_color: id } });
    if (!color) throw new NotFoundException('Color no encontrado');
    return color;
  }

  async create(dto: CreateDColoreDto): Promise<DColor> {
    const color = this.coloresRepo.create(dto);
    return this.coloresRepo.save(color);
  }
}
