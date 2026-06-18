import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DColoresModule } from './d.colores/d.colores.module';
import { EPerfilModule } from './e.perfil/e.perfil.module';
import { FTareasModule } from './f.tareas/f.tareas.module';
import { GHobbysModule } from './g.hobbys/g.hobbys.module';
import { AuthModule } from './auth/auth.module';
import { RopaModule } from './ropa/ropa.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUsersModule } from './b.users/b.users.module';
import { CmateriasModule } from './cmaterias/cmaterias.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '3306', 10) || 3306,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //autoLoadEntities: true,
        synchronize: false,
        ssl: {
          rejectUnauthorized: true,
          ca: require('fs').readFileSync(
            config.get<string>('DB_SSL_CA') ?? 'ca.pem',
          ),
        },
        charset: 'latin1',

      }),
    }),
    AuthModule,
    BUsersModule,
    DashboardModule,
    RopaModule,
    CmateriasModule,
    GHobbysModule,
    EPerfilModule,
    FTareasModule,
    DColoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule { }
