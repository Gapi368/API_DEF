import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtLector } from './jwt-lector';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUser } from 'src/b.users/entities/b.user.entity';
import { EPerfil } from 'src/e.perfil/entities/e.perfil.entity';
import { GHobby } from 'src/g.hobbys/entities/g.hobby.entity';
import { DColor } from 'src/d.colores/entities/d.colore.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([BUser, EPerfil, GHobby, DColor]), JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const secret = config.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error(
          'JWT_SECRET no está configurado.',
        );
      }
      return {
        secret,
        signOptions: { expiresIn: '7d' as const },
      };
    },
  }),
],
  controllers: [AuthController],
  providers: [AuthService, JwtLector],
  exports: [AuthService],
})
export class AuthModule {}
