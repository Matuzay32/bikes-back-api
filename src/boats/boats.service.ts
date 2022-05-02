import {
  HttpStatus,
  HttpVersionNotSupportedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boats } from './entities/boats.entity';
import { Photo } from './entities/photo.entity';
import { CreateBoatDto } from './dto/create-boats.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
@Injectable()
export class BoatsService {
  constructor(
    @InjectRepository(Boats)
    private readonly boatsRepository: Repository<Boats>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<CreateBoatDto[]> {
    const { limit, offset } = paginationQuery;
    return await this.boatsRepository.find({
      relations: ['photos'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const item = await this.boatsRepository.findOne(id, {
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
    const boat = await this.findOne(id);
    return this.boatsRepository.remove(boat);
  }

  async updateOne(id: string, updateBoatDto: CreateBoatDto) {
    const item = await this.boatsRepository.findOne(
      id /* , {
       relations: ['photos'],
       ...updateBoatDto,
     } */,
    );
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    for (let index = 0; index < updateBoatDto.photos.length; index++) {
      const photo = updateBoatDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }

    const boatUpdate = await this.boatsRepository.preload({
      id: +id,
      ...updateBoatDto,
    });

    return this.boatsRepository.save(boatUpdate);
  }

  async create(createBoatDto: CreateBoatDto[]) {
    createBoatDto.map(async (createBoatDto) => {
      const arrayFotos = await createBoatDto.photos;
      // console.log(arrayFotos);
      const boat = await this.boatsRepository.create({
        ...createBoatDto,
        photos: createBoatDto.photos,
      });
      const photos = await this.photoRepository.create(arrayFotos);

      const boatGuardado = await this.boatsRepository.save(boat);
      await this.photoRepository.save(photos);

      return await boatGuardado;
    });
    return await createBoatDto;
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
    const find = await this.boatsRepository.findOne(id, {
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

    const agreePhotosToBoatsEntity = await this.boatsRepository.create({
      ...find,
      photos: allPhotos,
    });

    const PhotosUpdated = await this.boatsRepository.save(
      agreePhotosToBoatsEntity,
    );
    await this.photoRepository.save(photos);

    return await PhotosUpdated;
  }
}
