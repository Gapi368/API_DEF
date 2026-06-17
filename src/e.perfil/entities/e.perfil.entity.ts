import { BUser } from "src/b.users/entities/b.user.entity";
import { DColor } from "src/d.colores/entities/d.colore.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity('Perfil')
export class EPerfil {
  @PrimaryColumn()
  id_perfil?: number;

  @Column({ length: 45 })
  nombreC_nombre?: string;

  @Column({ length: 45 })
  nombreC_apellidos?: string;

  @Column()
  edad?: number;

  @Column({ length: 45 })
  carrera?: string;

  @Column({ length: 45 })
  semestre_cursandose?: string;

  @Column({ length: 45 })
  apodo?: string;

  @Column({ nullable: true, default: 0 })
  puntosT_estres?: number;

  @Column({ nullable: true, default: 0 })
  racha?: number;

  @Column({ type: 'mediumblob' })
  img_perfil?: Buffer;

  @Column()
  color_acompanante?: number;

  @OneToOne(() => BUser)
  @JoinColumn({ name: 'id_perfil' })
  usuario?: BUser;

  @ManyToOne(() => DColor, (color) => color.perfiles)
  @JoinColumn({ name: 'color_acompanante' })
  colorObj?: DColor;
}

