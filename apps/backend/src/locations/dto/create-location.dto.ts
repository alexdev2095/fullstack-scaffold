import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'Warehouse ID' })
  @IsUUID()
  warehouse_id: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Location code',
    example: 'A-01-01',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Section', example: 'A', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  section: string;

  @ApiProperty({ description: 'Shelf', example: '01', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  shelf: string;

  @ApiProperty({ description: 'Level', example: '01', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  level: string;

  @ApiProperty({ description: 'Quantity', example: 25, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Minimum quantity',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  min_quantity?: number;

  @ApiPropertyOptional({
    description: 'Maximum quantity',
    example: 30,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  max_quantity?: number;
}
