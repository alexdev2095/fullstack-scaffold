import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationEntity } from './entities/location.entity';
import { AssignProductDto, CreateLocationDto, UpdateLocationDto } from './dto';
import { Stock } from 'src/common/types/stocks';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto): Promise<LocationEntity> {
    /**
     * FIXME: Crear en una utilidad y despues replazarlo
     *
     */
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createLocationDto.warehouse_id },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with ID ${createLocationDto.warehouse_id} not found`,
      );
    }

    /**
     * FIXME: Crear en una utilidad y despues replazarlo
     *
     */

    const product = await this.prisma.product.findUnique({
      where: { id: createLocationDto.product_id },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createLocationDto.product_id} not found`,
      );
    }

    /** */

    //FIXME: crear una utilidad
    // Check if location code is unique within warehouse
    const existingLocation = await this.prisma.location.findFirst({
      where: {
        warehouse_id: createLocationDto.warehouse_id,
        section: createLocationDto.section,
        shelf: createLocationDto.shelf,
        level: createLocationDto.level,
      },
    });

    if (existingLocation) {
      throw new ConflictException(
        'Location with this section, shelf, and level already exists in this warehouse',
      );
    }

    /** */

    const location = await this.prisma.location.create({
      data: {
        ...createLocationDto,
        min_quantity: createLocationDto.min_quantity || 0,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });

    // Update warehouse used capacity
    await this.updateWarehouseCapacity(createLocationDto.warehouse_id);

    return new LocationEntity({
      ...location,
      stock_status: this.getStockStatus(
        location.quantity,
        location.min_quantity,
      ),
    });
  }

  async findAll(): Promise<LocationEntity[]> {
    const locations = await this.prisma.location.findMany({
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return locations.map(
      (location) =>
        new LocationEntity({
          ...location,
          stock_status: this.getStockStatus(
            location.quantity,
            location.min_quantity,
          ),
        }),
    );
  }

  async findByWarehouse(warehouseId: string): Promise<LocationEntity[]> {
    const locations = await this.prisma.location.findMany({
      where: { warehouse_id: warehouseId },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: [{ section: 'asc' }, { shelf: 'asc' }, { level: 'asc' }],
    });

    return locations.map(
      (location) =>
        new LocationEntity({
          ...location,
          stock_status: this.getStockStatus(
            location.quantity,
            location.min_quantity,
          ),
        }),
    );
  }

  async findOne(id: string): Promise<LocationEntity> {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return new LocationEntity({
      ...location,
      stock_status: this.getStockStatus(
        location.quantity,
        location.min_quantity,
      ),
    });
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationEntity> {
    const existingLocation = await this.findOne(id);

    // If changing warehouse, product, section, shelf, or level, check for conflicts
    if (
      updateLocationDto.warehouse_id ||
      updateLocationDto.section ||
      updateLocationDto.shelf ||
      updateLocationDto.level
    ) {
      const warehouseId =
        updateLocationDto.warehouse_id || existingLocation.warehouse_id;
      const section = updateLocationDto.section || existingLocation.section;
      const shelf = updateLocationDto.shelf || existingLocation.shelf;
      const level = updateLocationDto.level || existingLocation.level;

      const conflictingLocation = await this.prisma.location.findFirst({
        where: {
          warehouse_id: warehouseId,
          section,
          shelf,
          level,
          NOT: { id },
        },
      });

      if (conflictingLocation) {
        throw new ConflictException(
          'Location with this section, shelf, and level already exists in this warehouse',
        );
      }
    }

    const location = await this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
      include: {
        product: true,
        warehouse: true,
      },
    });

    // Update warehouse capacity if warehouse changed
    if (updateLocationDto.warehouse_id) {
      await this.updateWarehouseCapacity(updateLocationDto.warehouse_id);
      await this.updateWarehouseCapacity(existingLocation.warehouse_id);
    }

    return new LocationEntity({
      ...location,
      stock_status: this.getStockStatus(
        location.quantity,
        location.min_quantity,
      ),
    });
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);

    await this.prisma.location.delete({
      where: { id },
    });

    // Update warehouse capacity
    await this.updateWarehouseCapacity(location.warehouse_id);
  }

  async assignProduct(
    locationId: string,
    assignProductDto: AssignProductDto,
  ): Promise<LocationEntity> {
    const location = await this.findOne(locationId);

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: assignProductDto.product_id },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${assignProductDto.product_id} not found`,
      );
    }

    const updatedLocation = await this.prisma.location.update({
      where: { id: locationId },
      data: {
        product_id: assignProductDto.product_id,
        quantity: assignProductDto.quantity,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });

    await this.updateWarehouseCapacity(location.warehouse_id);

    return new LocationEntity({
      ...updatedLocation,
      stock_status: this.getStockStatus(
        updatedLocation.quantity,
        updatedLocation.min_quantity,
      ),
    });
  }

  //FIXME: llevar a utilidad
  async updateQuantity(id: string, quantity: number): Promise<LocationEntity> {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const location = await this.prisma.location.update({
      where: { id },
      data: { quantity },
      include: {
        product: true,
        warehouse: true,
      },
    });

    await this.updateWarehouseCapacity(location.warehouse_id);

    return new LocationEntity({
      ...location,
      stock_status: this.getStockStatus(
        location.quantity,
        location.min_quantity,
      ),
    });
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

  private getStockStatus(quantity: number, minQuantity: number): Stock {
    if (quantity === 0) return Stock.OUT_OF_STOCK;
    if (quantity <= minQuantity) return Stock.LOW_STOCK;
    return Stock.IN_STOCK;
  }
}
