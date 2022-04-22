import { Module } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bikes } from './entities/bikes.entity';
import { Photo } from './entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bikes, Photo])],
  controllers: [BikesController],
  providers: [BikesService],
  exports: [BikesService],
})
export class BikesModule {}
