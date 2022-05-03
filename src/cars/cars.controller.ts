import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // Protocol,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SampleDto } from './../common/sample.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.carsService.findAll(paginationQuery);
  }

  // @Get()
  // findAll(): Promise<CreateCarDto[]> {
  //   return this.carsService.findAll();
  // }

  @Get(':id')
  findOne(@Param() params) {
    return this.carsService.findOne(params.id);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.carsService.deleteOne(params.id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateCarDto: CreateCarDto) {
    return this.carsService.updateOne(id, updateCarDto);
  }

  @Post()
  create(@Body() createCarDto: CreateCarDto[]) {
    return this.carsService.create(createCarDto);
  }

  @Delete('photo/:id')
  deletePhoto(@Param() params) {
    console.log(params.id);
    return this.carsService.deletePhoto(params.id);
  }

  @Patch('photo/:id')
  updateOnePhoto(@Param('id') id: string, @Body() updatePhotoDto: PhotoDto) {
    return this.carsService.updateOnePhoto(id, updatePhotoDto);
  }

  @Post('photo/:id')
  createOnePhoto(@Param('id') id, @Body() updatePhotoDto: PhotoDto[]) {
    return this.carsService.createOnePhoto(updatePhotoDto, id);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, calback) => {
          calback(null, `photo ${Date.now()}.jpg`);
        },
      }),
    }),
  )
  @Post('file')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      msg: `Archivo ${file.filename} cargado correctamente`,
    };
  }
}
