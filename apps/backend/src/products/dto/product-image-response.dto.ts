import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class ProductImageResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsBoolean()
  is_primary: boolean;

  @IsNumber()
  order: number;

  @IsUUID()
  product_id: string;

  @IsDate()
  created_at: Date;
}
