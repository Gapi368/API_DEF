import { Cmateria } from "src/cmaterias/entities/cmateria.entity";
import { EPerfil } from "src/e.perfil/entities/e.perfil.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Colores')
export class DColor {  
    @PrimaryGeneratedColumn()
  id_color?: number;

  @Column({ length: 45 })
  nombre_color?: string;

  @Column({ length: 60 })
  codigo_color?: string;

  @OneToMany(() => Cmateria, (cmateria) => cmateria.color)
  materias?: Cmateria[];

  @OneToMany(() => EPerfil, (perfil) => perfil.colorObj)
  perfiles?: EPerfil[];
}
