import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseStockMovementValidator {
  constructor(private prisma: PrismaService) {}

  async validateStockMovementExists(movementId: string): Promise<void> {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id: movementId },
    });

    if (!movement) {
      throw new NotFoundException(
        `Stock movement with ID ${movementId} not found`,
      );
    }
  }
}
