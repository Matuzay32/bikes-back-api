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
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
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
}
