import { ApiProperty } from '@nestjs/swagger';

export class LocationEntity {
  @ApiProperty({ description: 'Location ID' })
  id: string;

  @ApiProperty({ description: 'Warehouse ID' })
  warehouse_id: string;

  @ApiProperty({ description: 'Product ID' })
  product_id: string;

  @ApiProperty({ description: 'Location code', example: 'A-01-01' })
  code: string;

  @ApiProperty({ description: 'Section', example: 'A' })
  section: string;

  @ApiProperty({ description: 'Shelf', example: '01' })
  shelf: string;

  @ApiProperty({ description: 'Level', example: '01' })
  level: string;

  @ApiProperty({ description: 'Quantity', example: 25 })
  quantity: number;

  @ApiProperty({ description: 'Minimum quantity', example: 5 })
  min_quantity: number;

  @ApiProperty({
    description: 'Maximum quantity',
    required: false,
    example: 30,
  })
  max_quantity: number | null; // ✅ Cambiar a null para compatibilidad con Prisma

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;

  @ApiProperty({ description: 'Stock status', required: false })
  stock_status?: string;

  constructor(partial: Partial<LocationEntity>) {
    Object.assign(this, partial);
  }
}
