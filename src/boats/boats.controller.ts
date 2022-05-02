import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto/create-boats.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { PhotoDto } from './../common/dto/create-photo.dto';

@Controller('boats')
export class BoatsController {
  constructor(private readonly boatsService: BoatsService) {}

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<CreateBoatDto[]> {
    return this.boatsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.boatsService.findOne(params.id);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.boatsService.deleteOne(params.id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateBoatDto: CreateBoatDto) {
    return this.boatsService.updateOne(id, updateBoatDto);
  }

  @Post()
  create(@Body() createBoatDto: CreateBoatDto[]) {
    return this.boatsService.create(createBoatDto);
  }

  @Delete('photo/:id')
  deletePhoto(@Param() params) {
    console.log(params.id);
    return this.boatsService.deletePhoto(params.id);
  }

  @Patch('photo/:id')
  updateOnePhoto(@Param('id') id: string, @Body() updatePhotoDto: PhotoDto) {
    return this.boatsService.updateOnePhoto(id, updatePhotoDto);
  }
  @Post('photo/:id')
  createOnePhoto(@Param('id') id, @Body() updatePhotoDto: PhotoDto[]) {
    return this.boatsService.createOnePhoto(updatePhotoDto, id);
  }
}
