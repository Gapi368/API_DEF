import { BUser } from "src/b.users/entities/b.user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Hobbys')
export class GHobby {
    @PrimaryGeneratedColumn()
    id_hobby?: number;

    @Column({ length: 45 })
    nombre_hobby?: string;

    @Column()
    hobby_usuario?: number;

    @ManyToOne(() => BUser, (user) => user.hobbys)
    @JoinColumn({ name: 'hobby_usuario' })
    usuario?: BUser;
}

