import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WerehousesService } from './werehouses.service';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';

@Controller('werehouses')
export class WerehousesController {
  constructor(private readonly werehousesService: WerehousesService) {}

  @Post()
  create(@Body() createWerehouseDto: CreateWerehouseDto) {
    return this.werehousesService.create(createWerehouseDto);
  }

  @Get()
  findAll() {
    return this.werehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.werehousesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWerehouseDto: UpdateWerehouseDto) {
    return this.werehousesService.update(+id, updateWerehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.werehousesService.remove(+id);
  }
}
