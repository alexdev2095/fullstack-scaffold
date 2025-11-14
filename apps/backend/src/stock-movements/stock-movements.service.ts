import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { MovementType } from 'generated/prisma/enums';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<StockMovementEntity> {
    const {
      product_id,
      warehouse_id,
      location_id,
      type,
      quantity,
      reason,
      notes,
      created_by,
    } = createStockMovementDto;

    //FIXME: Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    // FIXME: Check if warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouse_id },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with ID ${warehouse_id} not found`,
      );
    }

    // FIXME: If location_id is provided, check if it exists and belongs to the warehouse and product
    let location = null;
    if (location_id) {
      location = await this.prisma.location.findFirst({
        where: {
          id: location_id,
          warehouse_id,
          product_id,
        },
      });

      if (!location) {
        throw new NotFoundException(
          `Location with ID ${location_id} not found for this product and warehouse`,
        );
      }
    }

    // Calculate previous and new stock
    let previousStock = 0;
    let newStock = 0;

    if (location) {
      previousStock = location.quantity;
      newStock = this.calculateNewStock(previousStock, quantity, type);
    } else {
      // Get total stock for product in warehouse
      const totalStock = await this.prisma.location.aggregate({
        where: {
          warehouse_id,
          product_id,
        },
        _sum: {
          quantity: true,
        },
      });
      previousStock = totalStock._sum.quantity || 0;
      newStock = this.calculateNewStock(previousStock, quantity, type);
    }

    // Create stock movement
    const stockMovement = await this.prisma.stockMovement.create({
      data: {
        product_id,
        warehouse_id,
        location_id,
        type,
        quantity,
        previous_stock: previousStock,
        new_stock: newStock,
        reason,
        notes,
        created_by,
      },
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
    });

    //FIXME: Update location quantity if location is specified
    if (location) {
      await this.prisma.location.update({
        where: { id: location_id },
        data: { quantity: newStock },
      });

      // Update warehouse capacity
      await this.updateWarehouseCapacity(warehouse_id);
    }

    return new StockMovementEntity(stockMovement);
  }

  async findAll(): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findByProduct(productId: string): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { product_id: productId },
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findByWarehouse(warehouseId: string): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { warehouse_id: warehouseId },
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findOne(id: string): Promise<StockMovementEntity> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            product: true,
            warehouse: true,
          },
        },
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return new StockMovementEntity(movement);
  }

  private calculateNewStock(
    previousStock: number,
    quantity: number,
    type: MovementType,
  ): number {
    switch (type) {
      case 'ENTRADA':
        return previousStock + quantity;
      case 'SALIDA':
        const newStock = previousStock - quantity;
        if (newStock < 0) {
          throw new BadRequestException(
            'Insufficient stock for this operation',
          );
        }
        return newStock;
      case 'AJUSTE':
        return quantity; // For adjustments, quantity becomes the new stock
      case 'TRANSFERENCIA':
        return previousStock - quantity; // For transfers, we subtract from source
      default:
        return previousStock;
    }
  }

  private async updateWarehouseCapacity(warehouseId: string): Promise<void> {
    const totalQuantity = await this.prisma.location.aggregate({
      where: { warehouse_id: warehouseId },
      _sum: { quantity: true },
    });

    await this.prisma.warehouse.update({
      where: { id: warehouseId },
      data: { used_capacity: totalQuantity._sum.quantity || 0 },
    });
  }

  // update(id: number, updateStockMovementDto: UpdateStockMovementDto) {
  //   return `This action updates a #${id} stockMovement`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} stockMovement`;
  // }
}
