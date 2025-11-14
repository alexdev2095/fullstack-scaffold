import { Module } from '@nestjs/common';
import { WerehousesService } from './werehouses.service';
import { WerehousesController } from './werehouses.controller';

@Module({
  controllers: [WerehousesController],
  providers: [WerehousesService],
})
export class WerehousesModule {}
