import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from 'generated/prisma/enums';
import { LocationEntity } from 'src/locations/entities/location.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { WarehouseEntity } from 'src/warehouses/entities/warehouse.entity';

export class StockMovementEntity {
  @ApiProperty({ description: 'Stock movement ID' })
  id: string;

  @ApiProperty({ description: 'Product ID' })
  product_id: string;

  @ApiProperty({ description: 'Warehouse ID' })
  warehouse_id: string;

  @ApiProperty({ description: 'Location ID', required: false })
  location_id: string | null;

  @ApiProperty({ description: 'Movement type', enum: MovementType })
  type: MovementType;

  @ApiProperty({ description: 'Quantity moved', example: 10 })
  quantity: number;

  @ApiProperty({ description: 'Previous stock', example: 15 })
  previous_stock: number;

  @ApiProperty({ description: 'New stock', example: 25 })
  new_stock: number;

  @ApiProperty({ description: 'Reason for movement', required: false })
  reason: string | null;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes: string | null;

  @ApiProperty({
    description: 'User who created the movement',
    required: false,
  })
  created_by: string | null;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ type: () => ProductEntity, required: false })
  product?: ProductEntity;

  @ApiProperty({ type: () => WarehouseEntity, required: false })
  warehouse?: WarehouseEntity;

  @ApiProperty({ type: () => LocationEntity, required: false })
  location?: LocationEntity;

  constructor(partial: Partial<StockMovementEntity>) {
    Object.assign(this, partial);
  }
}
