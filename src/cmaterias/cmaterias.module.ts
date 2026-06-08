import { Module } from '@nestjs/common';
import { CmateriasService } from './cmaterias.service';
import { CmateriasController } from './cmaterias.controller';
import { Cmateria } from './entities/cmateria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cmateria])],
  controllers: [CmateriasController],
  providers: [CmateriasService],
  exports: [CmateriasService],
})
export class CmateriasModule {}
