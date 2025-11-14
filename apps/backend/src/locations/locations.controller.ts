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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationEntity } from './entities/location.entity';
import { AssignProductDto } from './dto';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, type: LocationEntity })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, type: [LocationEntity] })
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get locations by warehouse' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiResponse({ status: 200, type: [LocationEntity] })
  findByWarehouse(@Param('warehouseId', ParseUUIDPipe) warehouseId: string) {
    return this.locationsService.findByWarehouse(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: LocationEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update location' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: LocationEntity })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Patch(':id/assign-product')
  @ApiOperation({ summary: 'Assign product to location' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: LocationEntity })
  assignProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignProductDto: AssignProductDto,
  ) {
    return this.locationsService.assignProduct(id, assignProductDto);
  }

  @Patch(':id/quantity/:quantity')
  @ApiOperation({ summary: 'Update location quantity' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'quantity', type: Number })
  @ApiResponse({ status: 200, type: LocationEntity })
  updateQuantity(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('quantity') quantity: number,
  ) {
    return this.locationsService.updateQuantity(id, Number(quantity));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.remove(id);
  }
}
