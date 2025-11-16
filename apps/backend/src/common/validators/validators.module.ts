import { Global, Module } from '@nestjs/common';
import { DatabaseProductValidator } from './database-product.validator';
import { DatabaseWarehouseValidator } from './database-warehouse.validator';
import { DatabaseStockMovementValidator } from './database-stock-movement.validator';
import { DatabaseLocationValidator } from './database-location.validator';

@Global()
@Module({
  providers: [
    DatabaseProductValidator,
    DatabaseWarehouseValidator,
    DatabaseStockMovementValidator,
    DatabaseLocationValidator,
  ],
  exports: [
    DatabaseProductValidator,
    DatabaseWarehouseValidator,
    DatabaseLocationValidator,
    DatabaseStockMovementValidator,
  ],
})
export class ValidatorsModule {}
