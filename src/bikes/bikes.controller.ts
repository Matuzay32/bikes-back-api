import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/create-bike.dto';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get()
  findAll(): Promise<CreateBikeDto[]> {
    return this.bikesService.findAll();
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
  create(@Body() createCarDto: CreateBikeDto): Promise<CreateBikeDto> {
    return this.bikesService.create(createCarDto);
  }
}
