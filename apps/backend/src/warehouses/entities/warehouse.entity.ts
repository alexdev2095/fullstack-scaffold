import { ApiProperty } from '@nestjs/swagger';

export class WarehouseEntity {
  @ApiProperty({
    description: 'Warehouse ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'Warehouse code', example: 'ALM-01' })
  code: string;

  @ApiProperty({ description: 'Warehouse name', example: 'Almacén Central' })
  name: string;

  @ApiProperty({ description: 'Warehouse address', required: false })
  address: string | null;

  @ApiProperty({ description: 'Warehouse phone', required: false })
  phone: string | null;

  @ApiProperty({ description: 'Warehouse email', required: false })
  email: string | null;

  @ApiProperty({ description: 'Total capacity', example: 1000 })
  capacity: number;

  @ApiProperty({ description: 'Used capacity', example: 450 })
  used_capacity: number;

  @ApiProperty({ description: 'Warehouse manager', required: false })
  manager: string | null;

  @ApiProperty({ description: 'Active status', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  @ApiProperty({ description: 'Last update date' })
  updated_at: Date;

  @ApiProperty({ type: [LocationEntity], required: false })
  locations?: Location[];

  @ApiProperty({ description: 'Capacity percentage', example: 45 })
  capacity_percentage?: number;

  constructor(partial: Partial<WarehouseEntity>) {
    Object.assign(this, partial);
  }
}
