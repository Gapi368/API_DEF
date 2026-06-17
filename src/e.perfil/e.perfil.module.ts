import { Module } from '@nestjs/common';
import { EPerfilService } from './e.perfil.service';
import { EPerfilController } from './e.perfil.controller';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import { FTarea } from 'src/f.tareas/entities/f.tarea.entity';
import { EPerfil } from './entities/e.perfil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EPerfil, FTarea, Cmateria])],
  controllers: [EPerfilController],
  providers: [EPerfilService],
  exports: [EPerfilService],
})
export class EPerfilModule {}
