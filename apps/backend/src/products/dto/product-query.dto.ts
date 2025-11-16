import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_active?: boolean;

  @ApiProperty({ required: false, default: 'created_at' })
  @IsString()
  @IsIn(['name', 'price', 'created_at', 'sku'])
  @IsOptional()
  sortBy?: string = 'created_at';

  @ApiProperty({ required: false, default: 'desc' })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
