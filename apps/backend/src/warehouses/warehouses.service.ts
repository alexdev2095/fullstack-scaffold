import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WarehouseEntity } from './entities/warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseEntity> {
    // Check if code already exists
    const existingWarehouse = await this.prisma.warehouse.findUnique({
      where: { code: createWarehouseDto.code },
    });

    if (existingWarehouse) {
      throw new ConflictException(
        `Warehouse with code ${createWarehouseDto.code} already exists`,
      );
    }

    const warehouse = await this.prisma.warehouse.create({
      data: createWarehouseDto,
      include: {
        locations: {
          include: {
            product: true,
          },
        },
      },
    });

    return new WarehouseEntity({
      ...warehouse,
      capacity_percentage: this.calculateCapacityPercentage(
        warehouse.used_capacity,
        warehouse.capacity,
      ),
    });
  }

  async findAll(): Promise<{ warehouses: WarehouseEntity[]; total: number }> {
    const [warehouses, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        include: {
          locations: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.warehouse.count(),
    ]);

    const warehousesWithPercentage = warehouses.map(
      (warehouse) =>
        new WarehouseEntity({
          ...warehouse,
          capacity_percentage: this.calculateCapacityPercentage(
            warehouse.used_capacity,
            warehouse.capacity,
          ),
        }),
    );

    return { warehouses: warehousesWithPercentage, total };
  }

  async findOne(id: string): Promise<WarehouseEntity> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return new WarehouseEntity({
      ...warehouse,
      capacity_percentage: this.calculateCapacityPercentage(
        warehouse.used_capacity,
        warehouse.capacity,
      ),
    });
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseEntity> {
    // Check if warehouse exists
    await this.findOne(id);

    // If updating code, check if it already exists
    if (updateWarehouseDto.code) {
      const existingWithCode = await this.prisma.warehouse.findUnique({
        where: { code: updateWarehouseDto.code },
      });

      if (existingWithCode && existingWithCode.id !== id) {
        throw new ConflictException(
          `Warehouse with code ${updateWarehouseDto.code} already exists`,
        );
      }
    }

    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
      include: {
        locations: {
          include: {
            product: true,
          },
        },
      },
    });

    return new WarehouseEntity({
      ...warehouse,
      capacity_percentage: this.calculateCapacityPercentage(
        warehouse.used_capacity,
        warehouse.capacity,
      ),
    });
  }

  async remove(id: string): Promise<void> {
    // Check if warehouse exists
    await this.findOne(id);

    // Check if warehouse has locations
    const locationsCount = await this.prisma.location.count({
      where: { warehouse_id: id },
    });

    if (locationsCount > 0) {
      throw new BadRequestException(
        'Cannot delete warehouse with existing locations. Remove locations first.',
      );
    }

    await this.prisma.warehouse.delete({
      where: { id },
    });
  }

  async getWarehouseStats(id: string) {
    const warehouse = await this.findOne(id);

    const stats = await this.prisma.location.aggregate({
      where: { warehouse_id: id },
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
    });

    const lowStockLocations = await this.prisma.location.count({
      where: {
        warehouse_id: id,
        quantity: {
          lte: this.prisma.location.fields.min_quantity,
        },
      },
    });

    return {
      warehouse: new WarehouseEntity({
        ...warehouse,
        capacity_percentage: this.calculateCapacityPercentage(
          warehouse.used_capacity,
          warehouse.capacity,
        ),
      }),
      stats: {
        total_products: stats._count.id,
        total_quantity: stats._sum.quantity || 0,
        low_stock_locations: lowStockLocations,
      },
    };
  }

  private calculateCapacityPercentage(used: number, total: number): number {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  }
}
