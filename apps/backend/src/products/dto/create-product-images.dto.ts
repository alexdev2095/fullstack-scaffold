import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean = false;

  @IsNumber()
  @IsOptional()
  order?: number = 0;
}
