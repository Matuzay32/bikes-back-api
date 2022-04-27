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
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<CreateFarmDto[]> {
    return this.farmsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.farmsService.findOne(params.id);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.farmsService.deleteOne(params.id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateFarmDto: CreateFarmDto) {
    return this.farmsService.updateOne(id, updateFarmDto);
  }

  @Post()
  create(@Body() createFarmDto: CreateFarmDto[]) {
    return this.farmsService.create(createFarmDto);
  }
}
