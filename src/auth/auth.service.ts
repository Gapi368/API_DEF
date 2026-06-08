import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BUser } from 'src/b.users/entities/b.user.entity';
import { Repository } from 'typeorm';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { GHobby } from 'src/g.hobbys/entities/g.hobby.entity';
import { DColor } from 'src/d.colores/entities/d.colore.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/comun/enum/rol.enum';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BUser)
    private usersRepo: Repository<BUser>,
    @InjectRepository(EPerfil)
    private perfilRepo: Repository<EPerfil>,
    @InjectRepository(GHobby)
    private hobbyRepo: Repository<GHobby>,
    @InjectRepository(DColor)
    private colorRepo: Repository<DColor>,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    //duplicados
    const existUsername = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (existUsername)
      throw new ConflictException('El username ya está en uso');

    const existEmail = await this.usersRepo.findOne({
      where: { correo: dto.correo },
    });
    if (existEmail) throw new ConflictException('El correo ya está en uso');

    //Hash
    const hashed = await bcrypt.hash(dto.password, 10);

    //crear user
    const user = this.usersRepo.create({
      nombre: dto.nombre,
      username: dto.username,
      correo: dto.correo,
      contrasena: hashed,
      role: Rol.USER,
    });
    const savedUser = await this.usersRepo.save(user);

    //colores
    let color = await this.colorRepo.findOne({ where: { id_color: 1 } });
    if (!color) {
      color = this.colorRepo.create({
        nombre_color: 'Azul',
        codigo_color: '#4A90D9',
      });
      color = await this.colorRepo.save(color);
    }

    //crear perfil
    const perfil = this.perfilRepo.create({
      id_perfil: savedUser.id_usuario,
      nombreC_nombre: dto?.nombre?.split(' ')[0] || '-',
      nombreC_apellidos:
        (dto.nombre ?? '').split(' ').slice(1).join(' ') || '-',
      edad: dto.edad,
      carrera: dto.carrera,
      semestre_cursandose: dto.semestre,
      apodo: dto.apodo,
      puntosT_estres: 0,
      racha: 0,
      img_perfil: Buffer.from('default'),
      color_acompanante: color.id_color,
    });
    await this.perfilRepo.save(perfil);

    //crear hobbis
    if (dto.hobbys && dto.hobbys.length > 0) {
      for (const nombre_hobby of dto.hobbys) {
        const hobby = this.hobbyRepo.create({
          nombre_hobby,
          hobby_usuario: savedUser.id_usuario,
        });
        await this.hobbyRepo.save(hobby);
      }
    }

    const payload = {
      id_usuario: savedUser.id_usuario,
      username: savedUser.username,
      role: savedUser.role,
    };

    return {
      message: 'Registro exitoso. ¡Bienvenid@!',
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: savedUser.id_usuario,
        username: savedUser.username,
        nombre: savedUser.nombre,
        correo: savedUser.correo,
        role: savedUser.role,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { username: dto.username },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatch = await bcrypt.compare(dto.password, user.contrasena);
    if (!passwordMatch)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      id_usuario: user.id_usuario,
      username: user.username,
      role: user.role,
    };

    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
      user: {
        id_usuario: user.id_usuario,
        username: user.username,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role,
      },
    };
  }
}
