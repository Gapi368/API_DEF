import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from 'src/comun/enum/rol.enum';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { GHobby } from 'src/g.hobbys/entities/g.hobby.entity';
import { Cmateria } from 'src/cmaterias/entities/cmateria.entity';


@Entity('Usuarios')
export class BUser {
    @PrimaryGeneratedColumn()
    id_usuario!: number;

    @Column({ unique: true })
    username: string = '';

    @Column()
    nombre!: string;

    @Column({ unique: true })
    correo: string = '';

    @Exclude()
    @Column()
    contrasena!: string;

    @Column({
        type: 'enum',
        enum: Rol,
        default: Rol.USER,
    })
    role?: Rol;

    @OneToMany(() => Cmateria, (materia) => materia.usuario)
    materias!: Cmateria[];

    @OneToMany(() => GHobby, (hobby) => hobby.usuario)
    hobbys!: GHobby[];

    @OneToOne(() => EPerfil, (perfil) => perfil.usuario)
    perfil!: EPerfil;
}
