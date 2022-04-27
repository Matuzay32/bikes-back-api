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
    for (let index = 0; index < updateBoatDto.photos.length; index++) {
      const photo = updateBoatDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }
    // console.log(findPhotos, ' photos id buscados en la tabla');

    const boatUpdate = await this.boatsRepository.preload({
      id: +id,
      ...updateBoatDto,
    });

    const item = await this.boatsRepository.findOne(id, {
      relations: ['photos'],
      ...updateBoatDto,
    });
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
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
}
