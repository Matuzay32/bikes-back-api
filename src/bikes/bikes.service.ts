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
@Injectable()
export class BikesService {
  constructor(
    @InjectRepository(Bikes)
    private readonly bikesRepository: Repository<Bikes>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll(): Promise<CreateBikeDto[]> {
    return await this.bikesRepository.find({
      relations: ['photos'],
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
    return this.bikesRepository.remove(bike);
  }

  async updateOne(id: string, updateBikeDto: CreateBikeDto) {
    for (let index = 0; index < updateBikeDto.photos.length; index++) {
      const photo = updateBikeDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }
    // console.log(findPhotos, ' photos id buscados en la tabla');

    const bikeUpdate = await this.bikesRepository.preload({
      id: +id,
      ...updateBikeDto,
    });

    const item = await this.bikesRepository.findOne(id, {
      relations: ['photos'],
      ...updateBikeDto,
    });
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    return this.bikesRepository.save(bikeUpdate);
  }

  async create(createBikeDto: CreateBikeDto[]) {
    createBikeDto.map(async (createBikeDto) => {
      const arrayFotos = await createBikeDto.photos;
      console.log(arrayFotos);
      const bike = await this.bikesRepository.create({
        ...createBikeDto,
        photos: createBikeDto.photos,
      });
      const photos = await this.photoRepository.create(arrayFotos);

      const bikeGuardado = await this.bikesRepository.save(bike);
      await this.photoRepository.save(photos);

      return await bikeGuardado;
    });
    return await createBikeDto;
  }
}
