import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Product SKU', example: 'LAPTOP-HP-001' })
  sku: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop HP Pavilion' })
  name: string;

  @ApiProperty({ description: 'Product description', required: false })
  description?: string | null;

  @ApiProperty({ description: 'Selling price', example: 899.99 })
  price: number;

  @ApiProperty({ description: 'Cost price', required: false })
  cost?: number | null;

  @ApiProperty({ description: 'Product category', required: false })
  category?: string | null;

  @ApiProperty({ description: 'Product brand', required: false })
  brand?: string | null;

  @ApiProperty({ description: 'Product weight in kg', required: false })
  weight?: number | null;

  @ApiProperty({ description: 'Product length in cm', required: false })
  length?: number | null;

  @ApiProperty({ description: 'Product width in cm', required: false })
  width?: number | null;

  @ApiProperty({ description: 'Product height in cm', required: false })
  height?: number | null;

  @ApiProperty({ description: 'Minimum stock level', example: 5 })
  min_stock: number;

  @ApiProperty({ description: 'Maximum stock level', required: false })
  max_stock?: number | null;

  @ApiProperty({ description: 'Product active status', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;

  @ApiProperty({
    description: 'Total stock across all locations',
    required: false,
  })
  total_stock?: number;

  @ApiProperty({ description: 'Stock status', required: false })
  stock_status?: string;

  constructor(partial: Partial<ProductEntity>) {
    // Convertir null a undefined para compatibilidad
    const processedPartial: any = {};

    for (const key in partial) {
      if (partial[key] === null) {
        processedPartial[key] = undefined;
      } else {
        processedPartial[key] = partial[key];
      }
    }

    Object.assign(this, processedPartial);
  }
}
