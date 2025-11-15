import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseWarehouseValidator {
  constructor(private prisma: PrismaService) {}

  async validateUniqueWarehouseCode(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { code },
    });

    if (existingWarehouse && existingWarehouse.id !== excludeId) {
      throw new ConflictException(`Warehouse with code ${code} already exists`);
    }
  }

  async validateWarehouseExists(warehouseId: string): Promise<void> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }
  }

  async validateWarehouseHasNoLocations(warehouseId: string): Promise<void> {
    const locationsCount = await this.prisma.location.count({
      where: { warehouse_id: warehouseId },
    });

    if (locationsCount > 0) {
      throw new ConflictException(
        'Cannot delete warehouse with existing locations. Remove locations first.',
      );
    }
  }
}
