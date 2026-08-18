// scripts/check-sync.ts
//
// Confere rapidamente o que foi sincronizado, sem depender do Prisma Studio.
// Como rodar: npx tsx scripts/check-sync.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const totalSeries = await prisma.serie.count();
  const totalCollections = await prisma.collection.count();
  const totalCards = await prisma.card.count();

  console.log(`Séries: ${totalSeries}`);
  console.log(`Coleções (sets): ${totalCollections}`);
  console.log(`Cartas: ${totalCards}`);

  // Mostra 5 cartas de uma série recente, pra confirmar que está em português
  const amostra = await prisma.card.findMany({
    take: 5,
    where: { collection: { serieId: "sv" } }, // Escarlate e Violeta
    select: {
      name: true,
      localId: true,
      collection: { select: { name: true } },
    },
  });

  console.log("\nAmostra (Escarlate e Violeta):");
  for (const c of amostra) {
    console.log(`  ${c.collection.name} #${c.localId} — ${c.name}`);
  }

  // Sets que ficaram com menos cartas do que deveriam (possível falha na sync)
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { cards: true } } },
  });
  const incompletos = collections.filter((c) => c._count.cards < c.cardCount);

  if (incompletos.length > 0) {
    console.log(`\n⚠️  ${incompletos.length} sets incompletos:`);
    for (const c of incompletos) {
      console.log(`  ${c.name}: ${c._count.cards}/${c.cardCount} cartas`);
    }
  } else {
    console.log("\nTodos os sets estão completos!");
  }
}

main()
  .catch((err) => console.error("Erro:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
