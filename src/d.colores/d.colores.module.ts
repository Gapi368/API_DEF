import { Module } from '@nestjs/common';
import { DColoresService } from './d.colores.service';
import { DColoresController } from './d.colores.controller';
import { DColor } from './entities/d.colore.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DColor])],
  controllers: [DColoresController],
  providers: [DColoresService],
  exports: [DColoresService],
})
export class DColoresModule {}
