import { Module } from '@nestjs/common';
import { RopaService } from './ropa.service';
import { RopaController } from './ropa.controller';
import { Ropa } from './entities/ropa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ropa])],
  controllers: [RopaController],
  providers: [RopaService],
  exports: [RopaService],
})
export class RopaModule {}
