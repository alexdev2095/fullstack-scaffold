import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WarehouseLocation } from '../types/location';

@Injectable()
export class DatabaseLocationValidator {
  constructor(private prisma: PrismaService) {}

  async validateUniqueLocation(
    location: WarehouseLocation,
    excludeId?: string,
  ): Promise<void> {
    const { warehouseId, section, shelf, level } = location;
    const existingLocation = await this.prisma.location.findFirst({
      where: {
        warehouse_id: warehouseId,
        section,
        shelf,
        level,
      },
    });

    if (existingLocation && existingLocation.id !== excludeId) {
      throw new ConflictException(
        'Location with this section, shelf, and level already exists in this warehouse',
      );
    }
  }

  async validateLocationExists(
    locationId: string,
    warehouseId?: string,
    productId?: string,
  ): Promise<any> {
    const where: any = { id: locationId };

    if (warehouseId) where.warehouse_id = warehouseId;
    if (productId) where.product_id = productId;

    const location = await this.prisma.location.findFirst({ where });

    if (!location) {
      const message =
        warehouseId && productId
          ? `Location with ID ${locationId} not found for this product and warehouse`
          : `Location with ID ${locationId} not found`;

      throw new NotFoundException(message);
    }

    return location;
  }
}
