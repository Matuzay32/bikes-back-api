import { Module } from '@nestjs/common';
import { BoatsService } from './boats.service';
import { BoatsController } from './boats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boats } from './entities/boats.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boats, Photo])],
  controllers: [BoatsController],
  providers: [BoatsService],
  exports: [BoatsService],
})
export class BoatsModule {}
