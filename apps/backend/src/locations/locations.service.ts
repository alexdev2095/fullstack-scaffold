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
import { DatabaseWarehouseValidator } from 'src/common/validators/database-warehouse.validator';
import { DatabaseLocationValidator } from 'src/common/validators/database-location.validator';
import { DatabaseProductValidator } from 'src/common/validators/database-product.validator';
import { WarehouseLocation } from 'src/common/types/location';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    private validatorLocation: DatabaseLocationValidator,
    private validatorWarehouse: DatabaseWarehouseValidator,
    private validatorProduct: DatabaseProductValidator,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<LocationEntity> {
    await this.validatorWarehouse.validateWarehouseExists(
      createLocationDto.warehouse_id,
    );

    await this.validatorProduct.validateProductExists(
      createLocationDto.product_id,
    );

    const locationValidate: WarehouseLocation = {
      warehouseId: createLocationDto.warehouse_id,
      section: createLocationDto.section,
      shelf: createLocationDto.shelf,
      level: createLocationDto.level,
    };
    await this.validatorLocation.validateUniqueLocation(locationValidate);

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
    await this.validatorWarehouse.validateWarehouseExists(warehouseId);

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

    if (
      updateLocationDto.warehouse_id ||
      updateLocationDto.section ||
      updateLocationDto.shelf ||
      updateLocationDto.level
    ) {
      const locationValidate: WarehouseLocation = {
        warehouseId:
          updateLocationDto.warehouse_id || existingLocation.warehouse_id,
        section: updateLocationDto.section || existingLocation.section,
        shelf: updateLocationDto.shelf || existingLocation.shelf,
        level: updateLocationDto.level || existingLocation.level,
      };
      await this.validatorLocation.validateUniqueLocation(locationValidate, id);
    }

    if (updateLocationDto.warehouse_id) {
      await this.validatorWarehouse.validateWarehouseExists(
        updateLocationDto.warehouse_id,
      );
    }

    if (updateLocationDto.product_id) {
      await this.validatorProduct.validateProductExists(
        updateLocationDto.product_id,
      );
    }

    const location = await this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
      include: {
        product: true,
        warehouse: true,
      },
    });

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

    await this.validatorProduct.validateProductExists(
      assignProductDto.product_id,
    );

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
