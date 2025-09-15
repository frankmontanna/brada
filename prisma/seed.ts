// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // --- Usuário admin ---
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  })
  console.log('Usuário admin criado/atualizado:', admin.username)

  // --- AppConfig do cloaker ---
  // Garante que exista exatamente 1 registro de configuração
  const existingCfg = await prisma.appConfig.findFirst()
  if (!existingCfg) {
    const cfg = await prisma.appConfig.create({
      data: {
        cloakerState: true,   // liga/desliga o cloaker
        blockStranger: true,  // bloqueia fora do BR
        blockMobile: false,   // bloqueio de mobile (padrão desligado)
        blockBot: true,       // bloqueia bots/crawlers
      },
    })
    console.log('AppConfig criado:', {
      cloakerState: cfg.cloakerState,
      blockStranger: cfg.blockStranger,
      blockMobile: cfg.blockMobile,
      blockBot: cfg.blockBot,
    })
  } else {
    console.log('AppConfig já existia, mantendo configuração atual.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
