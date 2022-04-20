import {
  Injectable,
  Inject,
  NotFoundException,
  HttpVersionNotSupportedException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { Cars } from './entities/cars.entity';
import { Photo } from './entities/photo.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Cars)
    private readonly carsRepository: Repository<Cars>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly connection: Connection,
  ) {}

  async findAll(): Promise<CreateCarDto[]> {
    return await this.carsRepository.find({
      relations: ['photos'],
    });
  }

  async findOne(id: string) {
    const item = await this.carsRepository.findOne(id, {
      relations: ['photos'],
    });
    if (!item) {
      throw new HttpVersionNotSupportedException({
        status: HttpStatus.NOT_FOUND,
        error: `El elemento con el id (${id}) no fue encontrado`,
      });
    }
    return item;
  }

  async deleteOne(id: string) {
    const coffee = await this.findOne(id);
    return this.carsRepository.remove(coffee);
  }

  async updateOne(id: string, updateCarDto: CreateCarDto) {
    for (let index = 0; index < updateCarDto.photos.length; index++) {
      const photo = updateCarDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }
    // console.log(findPhotos, ' photos id buscados en la tabla');

    const carUpdate = await this.carsRepository.preload({
      id: +id,
      ...updateCarDto,
    });

    const item = await this.carsRepository.findOne(id, {
      relations: ['photos'],
      ...updateCarDto,
    });
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    return this.carsRepository.save(carUpdate);
  }

  async create(createCarDto: CreateCarDto) {
    const coffee = this.carsRepository.create({
      ...createCarDto,
    });
    return this.carsRepository.save(coffee);
  }
}
