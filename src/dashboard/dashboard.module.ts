import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { FTarea } from 'src/f.tareas/entities/f.tarea.entity';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { GHobby } from 'src/g.hobbys/entities/g.hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EPerfil, FTarea, Cmateria, GHobby])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
