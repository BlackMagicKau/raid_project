import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.fruit.createMany({
    data: [
      { name: 'Apple', price: 1.00, stock: 30 },
      { name: 'Orange', price: 1.50, stock: 25 },
      { name: 'Banana', price: 2.00, stock: 40 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 