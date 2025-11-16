import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-image-response.dto';
// import { ProductImageResponseDto } from './product-image-response.dto';

export class ProductResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  min_stock: number;

  @IsString()
  stock_status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageResponseDto)
  images: ProductImageResponseDto[];

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
