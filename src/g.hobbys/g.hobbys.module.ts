import { Module } from '@nestjs/common';
import { GHobbysService } from './g.hobbys.service';
import { GHobbysController } from './g.hobbys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GHobby } from './entities/g.hobby.entity';


@Module({
  imports: [TypeOrmModule.forFeature([GHobby])],
  controllers: [GHobbysController],
  providers: [GHobbysService],
  exports: [GHobbysService],
})
export class GHobbysModule {}
