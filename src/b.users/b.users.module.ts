import { Module } from '@nestjs/common';
import { BUsersService } from './b.users.service';
import { BUsersController } from './b.users.controller';
import { BUser } from './entities/b.user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BUser])],
  controllers: [BUsersController],
  providers: [BUsersService],
  exports: [BUsersService],
})
export class BUsersModule {}
