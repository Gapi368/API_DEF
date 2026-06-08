import { BUser } from "src/b.users/entities/b.user.entity";
import { DColor } from "src/d.colores/entities/d.colore.entity";
import { FTarea } from "src/f.tareas/entities/f.tarea.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('Materias')
export class Cmateria {
    @PrimaryGeneratedColumn()
    id_materia: number = 0;

    @Column({ length: 45 })
    nombre_materia: string = '';

    @Column({ length: 45 })
    maestro: string = '';

    @Column()
    materia_usuario: number = 0;

    @Column()
    materia_color: number = 0;

    @ManyToOne(() => BUser, (user) => user.materias)
    @JoinColumn({ name: 'materia_usuario' })
    usuario: BUser = new BUser();

    @ManyToOne(() => DColor, (color) => color.materias)
    @JoinColumn({ name: 'materia_color' })
    color: DColor = new DColor();

    @OneToMany(() => FTarea, (tarea) => tarea.materia)
    tareas!: FTarea[];
}
