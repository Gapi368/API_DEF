import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBUserDto } from './dto/create-b.user.dto';
import { UpdateBUserDto } from './dto/update-b.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BUser } from './entities/b.user.entity';
import { Repository } from 'typeorm';
import { Rol } from 'src/comun/enum/rol.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BUsersService {
  constructor(
    @InjectRepository(BUser)
    private usersRepository: Repository<BUser>,
  ) {}

  async findAll(): Promise<BUser[]> {
    return this.usersRepository.find({
      select: { id_usuario: true, username: true, nombre: true, correo: true, role: true },
    });
  }

  async findOne(id: number): Promise<BUser> {
    const user = await this.usersRepository.findOne({
      where: { id_usuario: id },
      select: { id_usuario: true, username: true, nombre: true, correo: true, role: true },
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async findByUsername(username: string): Promise<BUser | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByCorreo(correo: string): Promise<BUser | null> {
    return this.usersRepository.findOne({ where: { correo } });
  }

  async create(dto: CreateBUserDto): Promise<Omit<BUser, 'contrasena'>> {
    const existingUsername = await this.findByUsername(dto.username);
    if (existingUsername) throw new ConflictException('El username ya está en uso');

    const existingEmail = await this.findByCorreo(dto.correo);
    if (existingEmail) throw new ConflictException('El correo ya está en uso');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      nombre: dto.nombre,
      username: dto.username,
      correo: dto.correo,
      contrasena: hashed,
      role: Rol.USER,
    });
    const saved = await this.usersRepository.save(user);
    const { contrasena, ...result } = saved;
    return result;
  }

  async update(id: number, dto: UpdateBUserDto): Promise<Omit<BUser, 'contrasena'>> {
    const user = await this.usersRepository.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    if (dto.username && dto.username !== user.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) throw new ConflictException('El username ya está en uso');
    }
    if (dto.correo && dto.correo !== user.correo) {
      const existing = await this.findByCorreo(dto.correo);
      if (existing) throw new ConflictException('El correo ya está en uso');
    }

    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      user.contrasena = hashed;
      delete dto.password;
    }

    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    const { contrasena, ...result } = saved;
    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    await this.usersRepository.remove(user);
    return { message: `Usuario ${id} eliminado correctamente` };
  }

  async makeAdmin(id: number): Promise<Omit<BUser, 'contrasena'>> {
    const user = await this.usersRepository.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    user.role = Rol.ADMIN;
    const saved = await this.usersRepository.save(user);
    const { contrasena, ...result } = saved;
    return result;
  }

  async makeDeveloper(id: number): Promise<Omit<BUser, 'contrasena'>> {
    const user = await this.usersRepository.findOne({ where: { id_usuario: id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    user.role = Rol.DEVELOPER;
    const saved = await this.usersRepository.save(user);
    const { contrasena, ...result } = saved;
    return result;
  }
}
