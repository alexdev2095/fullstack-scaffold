import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignProductDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  product_id: string;

  @ApiProperty({ description: 'Quantity to assign', example: 10, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
