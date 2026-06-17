import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Ropas')
export class Ropa {
    @PrimaryGeneratedColumn()
    id_ropa!: number;

    @Column({ type: 'mediumblob' })
    img_ropa?: Buffer;
}


