import {
  HttpStatus,
  HttpVersionNotSupportedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farms } from './entities/farms.entity';
import { Photo } from './entities/photo.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farms)
    private readonly farmsRepository: Repository<Farms>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<CreateFarmDto[]> {
    const { limit, offset } = paginationQueryDto;
    return await this.farmsRepository.find({
      relations: ['photos'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const item = await this.farmsRepository.findOne(id, {
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
    const farm = await this.findOne(id);
    if (!farm) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere borrar con id(${id}) `,
      );
    }
    return this.farmsRepository.remove(farm);
  }

  async updateOne(id: string, updateFarmDto: CreateFarmDto) {
    const item = await this.farmsRepository.findOne(
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

    const carUpdate = await this.farmsRepository.preload({
      id: +id,
      ...updateFarmDto,
    });

    return this.farmsRepository.save(carUpdate);
  }

  async create(CreateFarmDto: CreateFarmDto[]) {
    CreateFarmDto.map(async (CreateFarmDto) => {
      // const arrayFotos = await CreateFarmDto.photos;
      const car = await this.farmsRepository.create({
        ...CreateFarmDto,
        photos: CreateFarmDto.photos,
      });
      // const photos = await this.photoRepository.create(arrayFotos);

      const carGuardado = await this.farmsRepository.save(car);
      // await this.photoRepository.save(photos);

      return await carGuardado;
    });
    return await CreateFarmDto;
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
    const find = await this.farmsRepository.findOne(id, {
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

    const agreePhotosToFarmsEntity = await this.farmsRepository.create({
      ...find,
      photos: allPhotos,
    });

    const PhotosUpdated = await this.farmsRepository.save(
      agreePhotosToFarmsEntity,
    );
    await this.photoRepository.save(photos);

    return await PhotosUpdated;
  }
}
