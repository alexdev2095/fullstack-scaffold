import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { MovementType } from '@prisma/client';

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

    // Verificar que el producto existe
    const product = await this.prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    // Verificar que el almacén existe
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouse_id },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with ID ${warehouse_id} not found`,
      );
    }

    let previousStock = 0;
    let newStock = 0;

    // Si se proporciona location_id, trabajar con ubicación específica
    if (location_id) {
      const location = await this.prisma.location.findFirst({
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

      previousStock = location.quantity;
      newStock = this.calculateNewStock(previousStock, quantity, type);

      // Actualizar la cantidad en la ubicación
      await this.prisma.location.update({
        where: { id: location_id },
        data: { quantity: newStock },
      });
    } else {
      // Trabajar con stock total del producto en el almacén
      const totalStockResult = await this.prisma.location.aggregate({
        where: {
          warehouse_id,
          product_id,
        },
        _sum: {
          quantity: true,
        },
      });

      previousStock = totalStockResult._sum.quantity || 0;
      newStock = this.calculateNewStock(previousStock, quantity, type);
    }

    // Actualizar la capacidad del almacén
    await this.updateWarehouseCapacity(warehouse_id);

    // Crear el movimiento de stock sin relaciones
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
    });

    return new StockMovementEntity(stockMovement);
  }

  async findAll(): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findByProduct(productId: string): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findByWarehouse(warehouseId: string): Promise<StockMovementEntity[]> {
    const movements = await this.prisma.stockMovement.findMany({
      where: { warehouse_id: warehouseId },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => new StockMovementEntity(movement));
  }

  async findOne(id: string): Promise<StockMovementEntity> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return new StockMovementEntity(movement);
  }

  // Método separado para obtener movimientos con relaciones (si es necesario)
  async findOneWithDetails(id: string): Promise<any> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            code: true,
            section: true,
            shelf: true,
            level: true,
          },
        },
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return movement;
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
        return quantity;
      case 'TRANSFERENCIA':
        const transferStock = previousStock - quantity;
        if (transferStock < 0) {
          throw new BadRequestException('Insufficient stock for transfer');
        }
        return transferStock;
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
}
