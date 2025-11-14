import { PrismaClient } from '@prisma/client';
import { MovementType } from 'generated/prisma/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.stockMovement.deleteMany();
  await prisma.location.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  // Create warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      code: 'ALM-01',
      name: 'Almacén Central',
      address: 'Av. Principal 123, Ciudad',
      phone: '+1234567890',
      email: 'central@empresa.com',
      capacity: 1000,
      manager: 'Juan Pérez',
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      code: 'ALM-02',
      name: 'Almacén Norte',
      address: 'Calle Norte 456, Ciudad',
      phone: '+1234567891',
      email: 'norte@empresa.com',
      capacity: 500,
      manager: 'María García',
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      sku: 'LAPTOP-HP-001',
      name: 'Laptop HP Pavilion 15.6"',
      description:
        'Laptop HP Pavilion con procesador Intel Core i5, 8GB RAM, 512GB SSD',
      price: 899.99,
      cost: 650.0,
      category: 'Tecnología',
      brand: 'HP',
      weight: 2.1,
      length: 36.0,
      width: 24.5,
      height: 2.3,
      min_stock: 5,
      max_stock: 50,
      images: {
        create: [
          {
            url: '/uploads/products/laptop-hp-001/main.jpg',
            filename: 'main.jpg',
            is_primary: true,
            order: 0,
          },
          {
            url: '/uploads/products/laptop-hp-001/angle.jpg',
            filename: 'angle.jpg',
            is_primary: false,
            order: 1,
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: 'MOUSE-LOGI-002',
      name: 'Mouse Logitech MX Master 3',
      description:
        'Mouse ergonómico avanzado para productividad con seguimiento de alta precisión',
      price: 89.99,
      cost: 55.0,
      category: 'Accesorios',
      brand: 'Logitech',
      weight: 0.141,
      min_stock: 10,
      max_stock: 100,
      images: {
        create: [
          {
            url: '/uploads/products/mouse-logi-002/main.jpg',
            filename: 'main.jpg',
            is_primary: true,
            order: 0,
          },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sku: 'MONITOR-DELL-003',
      name: 'Monitor Dell 24" FHD',
      description:
        'Monitor Dell 24 pulgadas Full HD con tecnología ComfortView',
      price: 199.99,
      cost: 150.0,
      category: 'Tecnología',
      brand: 'Dell',
      weight: 3.5,
      length: 55.0,
      width: 8.0,
      height: 33.0,
      min_stock: 3,
      max_stock: 20,
      images: {
        create: [
          {
            url: '/uploads/products/monitor-dell-003/main.jpg',
            filename: 'main.jpg',
            is_primary: true,
            order: 0,
          },
        ],
      },
    },
  });

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      warehouse_id: warehouse1.id,
      product_id: product1.id,
      code: 'A-01-01',
      section: 'A',
      shelf: '01',
      level: '01',
      quantity: 25,
      min_quantity: 5,
      max_quantity: 30,
    },
  });

  const location2 = await prisma.location.create({
    data: {
      warehouse_id: warehouse1.id,
      product_id: product2.id,
      code: 'A-02-01',
      section: 'A',
      shelf: '02',
      level: '01',
      quantity: 50,
      min_quantity: 10,
      max_quantity: 60,
    },
  });

  const location3 = await prisma.location.create({
    data: {
      warehouse_id: warehouse2.id,
      product_id: product3.id,
      code: 'B-01-01',
      section: 'B',
      shelf: '01',
      level: '01',
      quantity: 15,
      min_quantity: 3,
      max_quantity: 20,
    },
  });

  // Create stock movements
  await prisma.stockMovement.create({
    data: {
      product_id: product1.id,
      warehouse_id: warehouse1.id,
      location_id: location1.id,
      type: MovementType.ENTRADA,
      quantity: 25,
      previous_stock: 0,
      new_stock: 25,
      reason: 'Compra inicial',
      notes: 'Lote #12345',
      created_by: 'Sistema',
    },
  });

  await prisma.stockMovement.create({
    data: {
      product_id: product2.id,
      warehouse_id: warehouse1.id,
      location_id: location2.id,
      type: MovementType.ENTRADA,
      quantity: 50,
      previous_stock: 0,
      new_stock: 50,
      reason: 'Compra inicial',
      notes: 'Lote #12346',
      created_by: 'Sistema',
    },
  });

  await prisma.stockMovement.create({
    data: {
      product_id: product3.id,
      warehouse_id: warehouse2.id,
      location_id: location3.id,
      type: MovementType.ENTRADA,
      quantity: 15,
      previous_stock: 0,
      new_stock: 15,
      reason: 'Compra inicial',
      notes: 'Lote #12347',
      created_by: 'Sistema',
    },
  });

  // Update warehouse capacities
  const warehouse1Total = await prisma.location.aggregate({
    where: { warehouse_id: warehouse1.id },
    _sum: { quantity: true },
  });

  const warehouse2Total = await prisma.location.aggregate({
    where: { warehouse_id: warehouse2.id },
    _sum: { quantity: true },
  });

  await prisma.warehouse.update({
    where: { id: warehouse1.id },
    data: { used_capacity: warehouse1Total._sum.quantity || 0 },
  });

  await prisma.warehouse.update({
    where: { id: warehouse2.id },
    data: { used_capacity: warehouse2Total._sum.quantity || 0 },
  });

  console.log('✅ Seeding completed!');
  console.log(`📦 Warehouses created: 2`);
  console.log(`🎯 Products created: 3`);
  console.log(`📍 Locations created: 3`);
  console.log(`📊 Stock movements created: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
