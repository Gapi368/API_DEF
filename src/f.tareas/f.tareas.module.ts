import { Module } from '@nestjs/common';
import { FTareasService } from './f.tareas.service';
import { FTareasController } from './f.tareas.controller';
import { FTarea } from './entities/f.tarea.entity';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([FTarea, Cmateria, EPerfil])],
  controllers: [FTareasController],
  providers: [FTareasService],
  exports: [FTareasService],
})
export class FTareasModule {}
