import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tareas')
export class FTarea {
   @PrimaryGeneratedColumn()
    id_tarea!: number;

    @Column()
    dificultad!: number;

    @Column()
    prioridad!: number;

    @Column({ default: 0 })
    puntos_estres!: number;

    @Column({ type: 'date', nullable: true })
    fecha_completada!: string | null;

    @Column({ length: 45 })
    nombre_tarea!: string;

    @Column()
    tarea_materia!: number;

    @Column({ type: 'date' })
    fecha!: string;

    @Column({ type: 'boolean', default: false })
    finalizada!: boolean;

    @ManyToOne(() => Cmateria, (materia) => materia.tareas)
    @JoinColumn({ name: 'tarea_materia' })
    materia!: Cmateria;
}
