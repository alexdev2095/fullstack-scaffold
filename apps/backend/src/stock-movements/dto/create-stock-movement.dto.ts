import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MovementType } from 'generated/prisma/enums';

export class CreateStockMovementDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsUUID()
  warehouse_id: string;

  @ApiPropertyOptional({ description: 'Location ID' })
  @IsUUID()
  @IsOptional()
  location_id?: string;

  @ApiProperty({ description: 'Movement type', enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ description: 'Quantity', example: 10, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: 'Reason for movement', maxLength: 255 })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'User who created the movement',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  created_by?: string;
}
