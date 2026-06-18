import { BUser } from "src/b.users/entities/b.user.entity";
import { DColor } from "src/d.colores/entities/d.colore.entity";
import { FTarea } from "src/f.tareas/entities/f.tarea.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('Materias')
export class Cmateria {
    @PrimaryGeneratedColumn()
    id_materia!: number;

    @Column({ length: 45 })
    nombre_materia!: string;

    @Column({ length: 45 })
    maestro!: string;

    @Column()
    materia_usuario!: number;

    @Column()
    materia_color!: number;

    @ManyToOne(() => BUser, (user) => user.materias)
    @JoinColumn({ name: 'materia_usuario' })
    usuario!: BUser;

    @ManyToOne(() => DColor, (color) => color.materias)
    @JoinColumn({ name: 'materia_color' })
    color!: DColor;

    @OneToMany(() => FTarea, (tarea) => tarea.materia)
    tareas!: FTarea[];
}
