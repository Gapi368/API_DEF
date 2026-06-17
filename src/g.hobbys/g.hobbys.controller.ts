import { Request, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { GHobbysService } from './g.hobbys.service';
import { CreateGHobbyDto } from './dto/create-g.hobby.dto';
import { UpdateGHobbyDto } from './dto/update-g.hobby.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';

@ApiTags('hobbys')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

@Controller('g.hobbys')
export class GHobbysController {
  constructor(private readonly hobbysService: GHobbysService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar hobby al perfil' })
  @ApiResponse({ status: 201, description: 'Hobby creado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  create(@Body() dto: CreateGHobbyDto, @Request() req) {
    return this.hobbysService.create(dto, req.user.id_usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis hobbies' })
  @ApiResponse({ status: 200, description: 'Lista de hobbies del usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll(@Request() req) {
    return this.hobbysService.findAllByUser(req.user.id_usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar hobby' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Hobby eliminado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes acceso a este hobby' })
  @ApiResponse({ status: 404, description: 'Hobby no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.hobbysService.remove(id, req.user.id_usuario);
  }
}