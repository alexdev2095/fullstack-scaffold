import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductEntity } from './entities';
import { ProductQueryDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean })
  @ApiResponse({ status: HttpStatus.OK })
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);

    return {
      data: result.products,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total: result.total,
        pages: Math.ceil(result.total / (query.limit || 10)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ProductEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Get product by SKU' })
  @ApiParam({ name: 'sku', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ProductEntity })
  findBySku(@Param('sku') sku: string) {
    return this.productsService.findBySku(sku);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ProductEntity })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Get total stock for product' })
  @ApiParam({ name: 'id', type: String })
  async getTotalStock(@Param('id', ParseUUIDPipe) id: string) {
    const totalStock = await this.productsService.getTotalStock(id);
    return {
      product_id: id,
      total_stock: totalStock,
    };
  }
}
