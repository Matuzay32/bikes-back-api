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
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<CreateBikeDto[]> {
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
  updateOne(@Param('id') id: string, @Body() updateCarDto: CreateBikeDto) {
    return this.bikesService.updateOne(id, updateCarDto);
  }

  @Post()
  create(@Body() createBikeDto: CreateBikeDto[]) {
    return this.bikesService.create(createBikeDto);
  }
}
