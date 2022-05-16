import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { BikesModule } from './bikes/bikes.module';
import { BoatsModule } from './boats/boats.module';
import { FarmsModule } from './farms/farms.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'prueba',
      autoLoadEntities: true, // models will be loaded automatically
      // entities: [Cars, Photo],
       synchronize: true,
    }),
    CarsModule,
    BikesModule,
    BoatsModule,
    FarmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
