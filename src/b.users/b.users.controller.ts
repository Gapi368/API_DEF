import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { BUsersService } from './b.users.service';
import { CreateBUserDto } from './dto/create-b.user.dto';
import { UpdateBUserDto } from './dto/update-b.user.dto';
import { ApiTags } from 'node_modules/@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth } from 'node_modules/@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';
import { RolesGuard } from 'src/comun/guards/roles.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Rol } from 'src/comun/enum/rol.enum';
import { Roles } from 'src/comun/decoradores/roles.decoradores';


@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)


@Controller('b.users')
export class BUsersController {
  constructor(private readonly usersService: BUsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener usuarios',
    description:
      'ADMIN y DEVELOPER: todos los usuarios. USER: solo su propio perfil.',
  })
  
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Request() req) {
    if (req.user.role === Rol.USER) {
      return this.usersService.findOne(req.user.id_usuario);
    }
    return this.usersService.findAll();
  }

  @Post()
  @Roles(Rol.DEVELOPER, Rol.ADMIN)
  @ApiOperation({
    summary: 'Crear usuario (solo DEVELOPER/ADMIN)',
    description: 'Crea un nuevo usuario con rol USER por defecto.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos suficientes' })
  create(@Body() dto: CreateBUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.DEVELOPER, Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar usuario (solo DEVELOPER/ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permisos suficientes' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (solo ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN puede eliminar' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/make-admin')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Promover usuario a ADMIN (solo ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario a promover' })
  @ApiResponse({ status: 200, description: 'Usuario promovido a ADMIN' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN puede promover' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.makeAdmin(id);
  }

  @Patch(':id/make-developer')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Promover usuario a DEVELOPER (solo ADMIN)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario a promover' })
  @ApiResponse({ status: 200, description: 'Usuario promovido a DEVELOPER' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Solo ADMIN puede promover' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  makeDeveloper(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.makeDeveloper(id);
  }
}
