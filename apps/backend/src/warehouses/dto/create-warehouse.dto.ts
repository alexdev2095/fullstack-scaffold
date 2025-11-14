import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    description: 'Warehouse code (unique)',
    example: 'ALM-01',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  code: string;

  @ApiProperty({
    description: 'Warehouse name',
    example: 'Almacén Central',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Warehouse address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Warehouse phone', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Warehouse email', maxLength: 100 })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: 'Total capacity', example: 1000, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  capacity: number;

  @ApiPropertyOptional({ description: 'Warehouse manager', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  manager?: string;

  @ApiPropertyOptional({ description: 'Active status', default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
