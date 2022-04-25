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
@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farms)
    private readonly farmsRepository: Repository<Farms>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async findAll(): Promise<CreateFarmDto[]> {
    return await this.farmsRepository.find({
      relations: ['photos'],
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
    return this.farmsRepository.remove(farm);
  }

  async updateOne(id: string, updateFarmDto: CreateFarmDto) {
    for (let index = 0; index < updateFarmDto.photos.length; index++) {
      const photo = updateFarmDto.photos[index];

      const photoUpdate = await this.photoRepository.preload({
        id: +photo.id,
        url: photo.url,
      });
      this.photoRepository.save(photoUpdate);
    }
    // console.log(findPhotos, ' photos id buscados en la tabla');

    const farmUpdate = await this.farmsRepository.preload({
      id: +id,
      ...updateFarmDto,
    });

    const item = await this.farmsRepository.findOne(id, {
      relations: ['photos'],
      ...updateFarmDto,
    });
    if (!item) {
      throw new NotFoundException(
        `No se pudo encontrar el elemento que quiere actualizar con id(${id}) `,
      );
    }
    return this.farmsRepository.save(farmUpdate);
  }

  async create(createFarmDto: CreateFarmDto) {
    const arrayFotos = await createFarmDto.photos;
    console.log(arrayFotos);
    const bike = await this.farmsRepository.create({
      ...createFarmDto,
      photos: createFarmDto.photos,
    });
    const photos = await this.photoRepository.create(arrayFotos);

    const farmGuardado = await this.farmsRepository.save(bike);
    await this.photoRepository.save(photos);

    return await farmGuardado;
  }
}
