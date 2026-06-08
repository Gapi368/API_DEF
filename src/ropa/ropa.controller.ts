import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RopaService } from './ropa.service';
import { CreateRopaDto } from './dto/create-ropa.dto';
import { UpdateRopaDto } from './dto/update-ropa.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/comun/guards/jwt-auth.guard';

@ApiTags('ropas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

@Controller('ropa')
export class RopaController {
  constructor(private readonly ropasService: RopaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar IDs de ropas disponibles para el avatar' })
  @ApiResponse({ status: 200, description: 'Lista de IDs de ropas' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findAll() {
    return this.ropasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener imagen de ropa por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Imagen de ropa' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Ropa no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ropasService.findOne(id);
  }
}
