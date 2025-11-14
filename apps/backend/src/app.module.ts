import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { WerehousesModule } from './werehouses/werehouses.module';
import { LocationsModule } from './locations/locations.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductsModule,
    PrismaModule,
    WerehousesModule,
    LocationsModule,
    StockMovementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
