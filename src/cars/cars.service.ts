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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
import { CreateBoatDto } from './../boats/dto/create-boats.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Cars)
    private readonly carsRepository: Repository<Cars>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly connection: Connection,
  ) {}

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<CreateCarDto[]> {
    const { limit, offset } = paginationQueryDto;
    return await this.carsRepository.find({
      relations: ['photos'],
      skip: offset,
      take: limit,
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
    const car = await this.findOne(id);
    if (!car) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere borrar con id(${id}) `,
      );
    }
    return this.carsRepository.remove(car);
  }

  async updateOne(id: string, updateCarDto: CreateCarDto) {
    const item = await this.carsRepository.findOne(
      id /* , {
      relations: ['photos'],
      // ...updateCarDto,
    } */,
    );
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    for (let index = 0; index < updateCarDto.photos.length; index++) {
      const photo = updateCarDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }
    // //console.log(findPhotos, ' photos id buscados en la tabla');

    const carUpdate = await this.carsRepository.preload({
      id: +id,
      ...updateCarDto,
    });

    return this.carsRepository.save(carUpdate);
  }

  async create(createCarDto: CreateCarDto[]) {
    createCarDto.map(async (createCarDto) => {
      const arrayFotos = await createCarDto.photos;
      const car = await this.carsRepository.create({
        ...createCarDto,
        photos: createCarDto.photos,
      });
      const photos = await this.photoRepository.create(arrayFotos);

      const carGuardado = await this.carsRepository.save(car);
      await this.photoRepository.save(photos);

      return await carGuardado;
    });
    return await createCarDto;
  }

  //Borra una photo dada por el Id
  async deletePhoto(id: string) {
    console.log(id);
    const photo = await this.photoRepository.findOne(id);
    if (!photo) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere borrar con id(${id}) `,
      );
    }
    return await this.photoRepository.remove(photo);
  }

  //Update one photo
  async updateOnePhoto(id: string, updatePhotoDto: PhotoDto) {
    const photoUpdate = await this.photoRepository.preload({
      id: +updatePhotoDto.id,
      url: updatePhotoDto.url,
    });

    const item = await this.photoRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    return await this.photoRepository.save(photoUpdate);
  }
  //Create Photos esto sirve para crear una photo
  async createOnePhoto(createdPhotoDto: PhotoDto[], id: string) {
    const find = await this.carsRepository.findOne(id, {
      relations: ['photos'],
    });
    if (!find) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento con id(${id}) `,
      );
    }
    const fotosActualizar = await createdPhotoDto;
    const photos = await this.photoRepository.create(fotosActualizar);
    const allPhotos = [...find.photos, ...photos];

    const agreePhotosToCarsEntity = await this.carsRepository.create({
      ...find,
      photos: allPhotos,
    });

    const PhotosUpdated = await this.carsRepository.save(
      agreePhotosToCarsEntity,
    );
    await this.photoRepository.save(photos);

    return await PhotosUpdated;
  }
}
