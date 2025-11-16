import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductImageDto,
  ProductQueryDto,
  ProductResponseDto,
} from './dto';
import { DatabaseProductValidator } from 'src/common/validators/database-product.validator';
import { ProductEntity, ProductImageEntity } from './entities';
import { Stock } from 'src/common/types/stocks';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private validatorProduct: DatabaseProductValidator,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    await this.validatorProduct.validateUniqueProductSku(createProductDto.sku);

    const imagesCreate = createProductDto.images?.length
      ? {
          create: createProductDto.images.map((img: CreateProductImageDto) => ({
            url: img.url, // campo requerido por Prisma
            filename: img.filename, // campo requerido por Prisma
            is_primary: img.is_primary ?? false,
            order: img.order ?? 0,
          })),
        }
      : undefined;

    const product = await this.prisma.product.create({
      data: {
        sku: createProductDto.sku,
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        cost: createProductDto.cost,
        category: createProductDto.category,
        brand: createProductDto.brand,
        weight: createProductDto.weight,
        length: createProductDto.length,
        width: createProductDto.width,
        height: createProductDto.height,
        min_stock: createProductDto.min_stock || 0,
        max_stock: createProductDto.max_stock,
        is_active:
          createProductDto.is_active !== undefined
            ? createProductDto.is_active
            : true,
        images: imagesCreate,
      },
      include: { images: true },
    });

    return new ProductEntity(product);
  }

  async findAll(
    query: ProductQueryDto,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      brand,
      is_active,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate total stock for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const totalStock = await this.getTotalStock(product.id);
        const stockStatus = this.getStockStatus(totalStock, product.min_stock);

        return new ProductEntity({
          ...product,
          total_stock: totalStock,
          stock_status: stockStatus,
        });
      }),
    );

    return {
      products: productsWithStock,
      total,
    };
  }
  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const totalStock = await this.getTotalStock(id);
    const stockStatus = this.getStockStatus(totalStock, product.min_stock);

    return new ProductEntity({
      ...product,
      total_stock: totalStock,
      stock_status: stockStatus,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    // Check if product exists
    await this.findOne(id);

    // If updating SKU, validate it's unique
    if (updateProductDto.sku) {
      await this.validatorProduct.validateUniqueProductSku(
        updateProductDto.sku,
        id,
      );
    }

    const { images, ...rest } = updateProductDto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        images: images
          ? {
              deleteMany: {},
              create: images.map((img) => ({
                url: img.url,
                filename: img.filename,
                is_primary: img.is_primary ?? false,
                order: img.order ?? 0,
              })),
            }
          : undefined,
      },
    });

    // const product = await this.prisma.product.update({
    //   where: { id },
    //   data: updateProductDto,
    //   include: {
    //     images: {
    //       orderBy: { order: 'asc' },
    //     },
    //   },
    // });

    // Handle images separately to avoid complex nested updates
    if (updateProductDto.images) {
      // Delete existing images
      await this.prisma.productImage.deleteMany({
        where: { product_id: id },
      });

      // Create new images
      if (updateProductDto.images.length > 0) {
        await this.prisma.productImage.createMany({
          data: updateProductDto.images.map((image) => ({
            ...image,
            product_id: id,
          })),
        });
      }

      // Reload product with images
      const updatedProduct = await this.prisma.product.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!updatedProduct)
        throw new NotFoundException(`Product ${id} not found`);

      const totalStock = await this.getTotalStock(id);
      const stockStatus = this.getStockStatus(
        totalStock,
        updatedProduct.min_stock,
      );

      return new ProductEntity({
        ...updatedProduct,
        total_stock: totalStock,
        stock_status: stockStatus,
      });
    }

    const totalStock = await this.getTotalStock(id);
    const stockStatus = this.getStockStatus(totalStock, product.min_stock);

    return new ProductEntity({
      ...product,
      total_stock: totalStock,
      stock_status: stockStatus,
    });
  }

  async remove(id: string): Promise<void> {
    // Check if product exists
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });
  }

  // ... resto de métodos sin cambios
  async findBySku(sku: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    const totalStock = await this.getTotalStock(product.id);
    const stockStatus = this.getStockStatus(totalStock, product.min_stock);

    return new ProductEntity({
      ...product,
      total_stock: totalStock,
      stock_status: stockStatus,
    });
  }

  async addImage(
    productId: string,
    imageData: any,
  ): Promise<ProductImageEntity> {
    await this.findOne(productId);

    const image = await this.prisma.productImage.create({
      data: {
        ...imageData,
        product_id: productId,
      },
    });

    return new ProductImageEntity(image);
  }

  async removeImage(imageId: string): Promise<void> {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async getTotalStock(productId: string): Promise<number> {
    const result = await this.prisma.location.aggregate({
      where: { product_id: productId },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity || 0;
  }

  private getStockStatus(totalStock: number, minStock: number): string {
    if (totalStock === 0) return Stock.OUT_OF_STOCK;
    if (totalStock <= minStock) return Stock.LOW_STOCK;
    return Stock.IN_STOCK;
  }

  private normalizeNulls<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;
    const clone: any = { ...obj };

    for (const key of Object.keys(clone)) {
      if (clone[key] === null) clone[key] = undefined;
    }

    return clone;
  }
}
