// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: "adminpassword123",
      role: "ADMIN",
      phoneNumber: "1234567890",
      whatsappCompatible: true,
      taxExemptionRequired: false,
      anonymous: false,
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
