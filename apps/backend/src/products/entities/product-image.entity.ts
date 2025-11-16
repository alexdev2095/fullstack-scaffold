import { ApiProperty } from '@nestjs/swagger';

export class ProductImageEntity {
  @ApiProperty({ description: 'Image ID' })
  id: string;

  @ApiProperty({ description: 'Product ID' })
  product_id: string;

  @ApiProperty({ description: 'Image URL' })
  url: string;

  @ApiProperty({ description: 'Image filename' })
  filename: string;

  @ApiProperty({ description: 'Is primary image' })
  is_primary: boolean;

  @ApiProperty({ description: 'Display order' })
  order: number;

  @ApiProperty({ description: 'Creation date' })
  created_at: Date;

  constructor(partial: Partial<ProductImageEntity>) {
    Object.assign(this, partial);
  }
}
