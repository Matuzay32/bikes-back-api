import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto/create-boats.dto';

@Controller('boats')
export class BoatsController {
  constructor(private readonly boatsService: BoatsService) {}

  @Get()
  findAll() {
    return this.boatsService.findAll();
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
  create(@Body() createBoatDto: CreateBoatDto) {
    return this.boatsService.create(createBoatDto);
  }
}
