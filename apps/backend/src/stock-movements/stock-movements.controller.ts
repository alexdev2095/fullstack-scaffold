import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockMovementEntity } from './entities/stock-movement.entity';

@ApiTags('stock-movements')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a stock movement' })
  @ApiResponse({ status: 201, type: StockMovementEntity })
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiResponse({ status: 200, type: [StockMovementEntity] })
  findAll() {
    return this.stockMovementsService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get stock movements by product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, type: [StockMovementEntity] })
  findByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.stockMovementsService.findByProduct(productId);
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get stock movements by warehouse' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiResponse({ status: 200, type: [StockMovementEntity] })
  findByWarehouse(@Param('warehouseId', ParseUUIDPipe) warehouseId: string) {
    return this.stockMovementsService.findByWarehouse(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock movement by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: StockMovementEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stockMovementsService.findOne(id);
  }
}
