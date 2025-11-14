import { ApiProperty } from '@nestjs/swagger';
import { Warehouse } from '@prisma/client';
import { LocationEntity } from 'src/locations/entities/location.entity';

export class WarehouseEntity implements Warehouse {
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

  // Cambiar el tipo para que sea compatible con Prisma
  @ApiProperty({ type: () => [Object], required: false })
  locations?: any[];

  @ApiProperty({
    description: 'Capacity percentage',
    example: 45,
    required: false,
  })
  capacity_percentage?: number;

  constructor(partial: Partial<WarehouseEntity>) {
    Object.assign(this, partial);
  }
}
