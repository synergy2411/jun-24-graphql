import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "John Doe",
      age: 23,
      email: "john@test.com",
      password: "john123",
      role: "ANALYST",
    },
  });

  const allUsers = await prisma.user.findMany();

  console.log(allUsers);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
