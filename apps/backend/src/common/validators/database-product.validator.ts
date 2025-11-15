import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseProductValidator {
  constructor(private prisma: PrismaService) {}

  async validateUniqueProductSku(
    sku: string,
    excludeId?: string,
  ): Promise<void> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct && existingProduct.id !== excludeId) {
      throw new ConflictException(`Product with SKU ${sku} already exists`);
    }
  }

  async validateProductExists(productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  async validateSufficientStock(
    locationId: string,
    quantity: number,
  ): Promise<void> {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${locationId} not found`);
    }

    if (location.quantity < quantity) {
      throw new ConflictException(
        `Insufficient stock. Available: ${location.quantity}, Requested: ${quantity}`,
      );
    }
  }
}
