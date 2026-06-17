import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRopaDto } from './dto/create-ropa.dto';
import { UpdateRopaDto } from './dto/update-ropa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ropa } from './entities/ropa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RopaService {
  constructor(
    @InjectRepository(Ropa)
    private ropasRepo: Repository<Ropa>,
  ) {}

  async findAll(): Promise<{ id_ropa: number }[]> {
    const ropas = await this.ropasRepo.find({ select: { id_ropa: true } });
    return ropas;
  }

  async findOne(id: number): Promise<Ropa> {
    const ropa = await this.ropasRepo.findOne({ where: { id_ropa: id } });
    if (!ropa) throw new NotFoundException('Ropa no encontrada');
    return ropa;
  }
}
