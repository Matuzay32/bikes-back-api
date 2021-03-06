import {
  HttpStatus,
  HttpVersionNotSupportedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bikes } from './entities/bikes.entity';
import { Photo } from './entities/photo.entity';
import { CreateBikeDto } from './dto/create-bike.dto';
import { skip } from 'rxjs';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bikes)
    private readonly bikesRepository: Repository<Bikes>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<CreateBikeDto[]> {
    const { limit, offset } = paginationQueryDto;
    return await this.bikesRepository.find({
      relations: ['photos'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const item = await this.bikesRepository.findOne(id, {
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
    const bike = await this.findOne(id);
    if (!bike) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere borrar con id(${id}) `,
      );
    }
    return this.bikesRepository.remove(bike);
  }

  async updateOne(id: string, updateBikeDto: CreateBikeDto) {
    const item = await this.bikesRepository.findOne(
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
    // for (let index = 0; index < updateCarDto.photos.length; index++) {
    //   const photo = updateCarDto.photos[index];

    //   const photoUpdate = await this.photoRepository.preload({
    //     id: +photo.id,
    //     url: photo.url,
    //   });
    //   this.photoRepository.save(photoUpdate);
    // }
    // ////console.log(findPhotos, ' photos id buscados en la tabla');

    const bikeUpdate = await this.bikesRepository.preload({
      id: +id,
      ...updateBikeDto,
    });

    return this.bikesRepository.save(bikeUpdate);
  }

  async create(CreateBikeDto: CreateBikeDto[]) {
    CreateBikeDto.map(async (CreateBikeDto) => {
      // const arrayFotos = await CreateBikeDto.photos;
      const bike = await this.bikesRepository.create({
        ...CreateBikeDto,
        photos: CreateBikeDto.photos,
      });
      // const photos = await this.photoRepository.create(arrayFotos);

      const bikeGuardado = await this.bikesRepository.save(bike);
      // await this.photoRepository.save(photos);

      return await bikeGuardado;
    });
    return await CreateBikeDto;
  }

  //Borra una photo dada por el Id
  async deletePhoto(id: string) {
    //console.log(id);
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
    const find = await this.bikesRepository.findOne(id, {
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

    const agreePhotosToBikeEntity = await this.bikesRepository.create({
      ...find,
      photos: allPhotos,
    });

    const PhotosUpdated = await this.bikesRepository.save(
      agreePhotosToBikeEntity,
    );
    await this.photoRepository.save(photos);

    return await PhotosUpdated;
  }
}
