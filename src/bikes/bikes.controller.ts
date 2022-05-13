import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpVersionNotSupportedException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { of } from 'rxjs';
import { join } from 'path';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.bikesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.bikesService.findOne(params.id);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.bikesService.deleteOne(params.id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateBikeDto: CreateBikeDto) {
    return this.bikesService.updateOne(id, updateBikeDto);
  }

  @Post()
  create(@Body() CreateBikeDto: CreateBikeDto[]) {
    return this.bikesService.create(CreateBikeDto);
  }

  @Delete('photo/:id')
  deletePhoto(@Param() params) {
    //console.log(params.id);
    return this.bikesService.deletePhoto(params.id);
  }

  @Patch('photo/:id')
  updateOnePhoto(@Param('id') id: string, @Body() updatePhotoDto: PhotoDto) {
    return this.bikesService.updateOnePhoto(id, updatePhotoDto);
  }

  @Post('photo/:id')
  createOnePhoto(@Param('id') id, @Body() updatePhotoDto: PhotoDto[]) {
    return this.bikesService.createOnePhoto(updatePhotoDto, id);
  }

  //Upload one file
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${uuidv4()}.jpg`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const nameOriginal = file.originalname.toLocaleLowerCase();
        // //console.log(nameOriginal);
        if (!nameOriginal.match(/(.gif|.png|.jpg|.jpeg)$/)) {
          return callback(
            new HttpVersionNotSupportedException({
              status: HttpStatus.NOT_FOUND,
              error: `El archivo tiene una extension no valida, validas: gif png jpg jpeg`,
            }),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `Archivo ${file.filename} cargado correctamente`,
    };
  }
  //Upload multiple files
  @Post('files')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${uuidv4()}.jpg`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const nameOriginal = file.originalname.toLocaleLowerCase();
        if (!nameOriginal.match(/(.gif|.png|.jpg|.jpeg)$/)) {
          return callback(
            new HttpVersionNotSupportedException({
              status: HttpStatus.NOT_FOUND,
              error: `Uno de los archivos tiene una extension no valida. Validas: gif png jpg jpeg`,
            }),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((item) => {
      return { url: item.filename };
    });
  }

  @Get('uploads/:imagename')
  findProfileImage(@Param() params, @Res() res) /* : Observable<Object>  */ {
    console.log(params);
    const { imagename } = params;

    return of(res.sendFile(join(process.cwd(), `uploads/${imagename}`)));
  }
}
