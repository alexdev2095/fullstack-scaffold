import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WarehouseEntity } from './entities/warehouse.entity';

@ApiTags('warehouses')
@Controller('werehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({ status: 201, type: WarehouseEntity })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({ status: 200, type: [WarehouseEntity] })
  async findAll() {
    const result = await this.warehousesService.findAll();
    return {
      data: result.warehouses,
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: WarehouseEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: WarehouseEntity })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWerehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateWerehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.warehousesService.remove(id);
  }
}
