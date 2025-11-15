import { Global, Module } from '@nestjs/common';
import { DatabaseProductValidator } from './database-product.validator';
import { DatabaseWarehouseValidator } from './database-warehouse.validator';

@Global()
@Module({
  providers: [DatabaseProductValidator, DatabaseWarehouseValidator],
  exports: [DatabaseProductValidator, DatabaseWarehouseValidator],
})
export class ValidatorsModule {}
