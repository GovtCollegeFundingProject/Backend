import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      email: 'example@gmail.com',
      password: 'password123',
      role: 'INDIVIDUAL',
      phoneNumber: '1234567890',
      whatsappCompatible: true,
      taxExemptionRequired: false,
      anonymous: false,
    },
  })

  console.log('User created:', user)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
