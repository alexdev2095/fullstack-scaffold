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

  @ApiProperty({
    description: 'Product description',
    required: false,
    example: 'Laptop HP Pavilion 15.6" Intel Core i5',
  })
  description: string | null;

  @ApiProperty({ description: 'Selling price', example: 899.99 })
  price: number;

  @ApiProperty({ description: 'Cost price', required: false, example: 650.0 })
  cost: number | null;

  @ApiProperty({
    description: 'Product category',
    required: false,
    example: 'Tecnología',
  })
  category: string | null;

  @ApiProperty({ description: 'Product brand', required: false, example: 'HP' })
  brand: string | null;

  @ApiProperty({
    description: 'Product weight in kg',
    required: false,
    example: 2.1,
  })
  weight: number | null;

  @ApiProperty({
    description: 'Product length in cm',
    required: false,
    example: 36.0,
  })
  length: number | null;

  @ApiProperty({
    description: 'Product width in cm',
    required: false,
    example: 24.5,
  })
  width: number | null;

  @ApiProperty({
    description: 'Product height in cm',
    required: false,
    example: 2.3,
  })
  height: number | null;

  @ApiProperty({ description: 'Minimum stock level', example: 5 })
  min_stock: number;

  @ApiProperty({
    description: 'Maximum stock level',
    required: false,
    example: 50,
  })
  max_stock: number | null;

  @ApiProperty({ description: 'Product active status', example: true })
  is_active: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updated_at: Date;

  // Relations (optional - only when included in query)
  //   @ApiProperty({ type: () => [ProductImageEntity], required: false })
  //   images?: ProductImage[];

  //   @ApiProperty({ type: () => [LocationEntity], required: false })
  //   locations?: Location[];

  // Virtual fields (computed)
  @ApiProperty({
    description: 'Total stock across all locations',
    required: false,
  })
  total_stock?: number;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
