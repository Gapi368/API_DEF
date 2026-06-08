import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: `Crea un nuevo usuario con **rol USER automático**.
    No se permite enviar el rol en el request.
    Incluye el cuestionario inicial de la app: edad, carrera, semestre, apodo y hobbies.`,
    })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message: 'Registro exitoso. ¡Bienvenid@!',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id_usuario: 2,
          username: 'alondrap',
          nombre: 'Alondra Pérez',
          correo: 'alondra@uni.edu.mx',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o campos faltantes' })
  @ApiResponse({ status: 409, description: 'Username o correo ya en uso' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: `Valida credenciales y retorna un **token JWT**. 
   El payload del token incluye: \`id_usuario\`, \`username\`, \`role\`.
   Usa el token en el header: \`Authorization: Bearer {token}\``,
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna JWT',
    schema: {
      example: {
        message: 'Login exitoso',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id_usuario: 1,
          username: 'admin',
          nombre: 'Administrador',
          correo: 'admin@estresapp.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
