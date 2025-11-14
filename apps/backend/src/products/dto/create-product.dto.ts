import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
// import { CreateProductImageDto } from './create-product-image.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product SKU (must be unique)',
    example: 'LAPTOP-HP-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop HP Pavilion',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Laptop HP Pavilion 15.6" Intel Core i5, 8GB RAM, 512GB SSD',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Selling price',
    example: 899.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Cost price',
    example: 650.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  cost?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Tecnología',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'HP',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Product weight in kg',
    example: 2.1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product length in cm',
    example: 36.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  length?: number;

  @ApiPropertyOptional({
    description: 'Product width in cm',
    example: 24.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  width?: number;

  @ApiPropertyOptional({
    description: 'Product height in cm',
    example: 2.3,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  height?: number;

  @ApiPropertyOptional({
    description: 'Minimum stock level',
    example: 5,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  min_stock?: number;

  @ApiPropertyOptional({
    description: 'Maximum stock level',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  max_stock?: number;

  @ApiPropertyOptional({
    description: 'Product active status',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  //   @ApiPropertyOptional({
  //     type: [CreateProductImageDto],
  //     description: 'Product images',
  //   })
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => CreateProductImageDto)
  //   @IsOptional()
  //   images?: CreateProductImageDto[];
}
