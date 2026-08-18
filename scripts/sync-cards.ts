// scripts/sync-cards.ts
//
// Popula o banco (Serie, Collection, Card) a partir da TCGdex API.
// Roda uma vez no início, e depois periodicamente (ex: 1x por semana)
// pra pegar sets/cartas novas.
//
// Como rodar: npx tsx scripts/sync-cards.ts

import TCGdex from "@tcgdex/sdk";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

// 'pt' = cartas retornadas já em português (nome, texto, etc)
const tcgdexPt = new TCGdex("pt");
// fallback: sets antigos ainda não foram traduzidos pra pt pela comunidade,
// então quando o pt vier vazio, buscamos em inglês pra não perder a carta
const tcgdexEn = new TCGdex("en");

const prisma = new PrismaClient();

// Arquivo local que guarda quais sets já foram sincronizados com sucesso.
// Assim, se o script cair no meio (rede, banco, etc), rodar de novo pula
// tudo que já está pronto e vai direto pro que falta — sem perder as horas
// já gastas nem duplicar trabalho.
const CHECKPOINT_PATH = path.join(
  process.cwd(),
  "scripts",
  ".sync-checkpoint.json",
);

function loadCheckpoint(): Set<string> {
  if (!fs.existsSync(CHECKPOINT_PATH)) return new Set();
  const raw = fs.readFileSync(CHECKPOINT_PATH, "utf-8");
  return new Set(JSON.parse(raw));
}

function saveCheckpoint(done: Set<string>) {
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify([...done]));
}

// Além do arquivo de checkpoint, verifica direto no banco quais sets já
// estão completos (cardCount esperado == cartas realmente salvas). Isso é
// o que permite retomar mesmo numa primeira execução da versão nova do
// script, reconhecendo o progresso feito em execuções anteriores.
async function loadCompletedFromDb(): Promise<Set<string>> {
  const collections = await withRetry(
    () =>
      prisma.collection.findMany({
        include: { _count: { select: { cards: true } } },
      }),
    "listar collections existentes",
  );
  const done = new Set<string>();
  for (const c of collections) {
    if (c._count.cards >= c.cardCount && c.cardCount > 0) {
      done.add(c.id);
    }
  }
  return done;
}

// Pequena pausa entre chamadas pra não sobrecarregar a API
// (boa prática mesmo sem rate limit documentado)
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tenta rodar uma função async até 4 vezes, com pausa crescente entre tentativas.
// Usado tanto nas chamadas à API da TCGdex quanto nas operações do Prisma,
// pra sobreviver a quedas momentâneas de rede/conexão (o que já aconteceu
// nos dois lados em execuções anteriores).
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  attempts = 4,
): Promise<T> {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts) throw err;
      console.warn(
        `  Falhou (${label}), tentativa ${i}/${attempts}. Retentando em ${i * 3}s...`,
      );
      await sleep(i * 3000);
    }
  }
  throw new Error("unreachable");
}

async function main() {
  const fileCheckpoint = loadCheckpoint();
  const dbCheckpoint = await loadCompletedFromDb();
  const done = new Set([...fileCheckpoint, ...dbCheckpoint]);

  if (done.size > 0) {
    console.log(`Retomando: ${done.size} sets já sincronizados serão pulados.`);
    saveCheckpoint(done); // já grava o que veio do banco, pra próxima vez ser só arquivo
  }

  console.log("Buscando lista de séries...");

  // 1. Lista todas as séries (ex: "Scarlet & Violet", "Sword & Shield"...)
  // Isso retorna uma versão "resumida" de cada série (só id e nome)
  const seriesList = await withRetry(
    () => tcgdexPt.serie.list(),
    "listar séries",
  );
  console.log(`Encontradas ${seriesList.length} séries.`);

  for (const serieResume of seriesList) {
    // 2. Salva a série no banco.
    // upsert = "se já existe (mesmo id), atualiza; senão, cria"
    // Isso é importante porque vamos rodar esse script várias vezes,
    // e não queremos duplicar dados nem dar erro de "já existe".
    await withRetry(
      () =>
        prisma.serie.upsert({
          where: { id: serieResume.id },
          update: { name: serieResume.name },
          create: { id: serieResume.id, name: serieResume.name },
        }),
      `serie ${serieResume.id}`,
    );

    // 3. Busca os detalhes completos da série, que incluem a lista de sets
    const serie = await withRetry(
      () => tcgdexPt.serie.get(serieResume.id),
      `detalhes série ${serieResume.id}`,
    );
    console.log(`\nSérie: ${serie.name} (${serie.sets.length} sets)`);

    for (const setResume of serie.sets) {
      // Já sincronizado numa execução anterior? Pula direto, sem gastar
      // tempo nem chamada de API com ele.
      if (done.has(setResume.id)) {
        console.log(`  Set: ${setResume.name} — já sincronizado, pulando`);
        continue;
      }

      // 4. Busca os detalhes completos do set — é aqui que vem a lista de cartas.
      // Se o set não tem tradução em pt ainda, a lista de cartas vem vazia —
      // nesse caso, busca a mesma coisa em inglês como fallback.
      let set = await withRetry(
        () => tcgdexPt.set.get(setResume.id),
        `set ${setResume.id} (pt)`,
      );
      let usedFallback = false;
      if (set.cards.length === 0) {
        set = await withRetry(
          () => tcgdexEn.set.get(setResume.id),
          `set ${setResume.id} (en)`,
        );
        usedFallback = true;
      }

      await withRetry(
        () =>
          prisma.collection.upsert({
            where: { id: set.id },
            update: {
              name: set.name,
              logo: set.logo ?? null,
              cardCount: set.cardCount.total,
              serieId: serieResume.id,
            },
            create: {
              id: set.id,
              name: set.name,
              logo: set.logo ?? null,
              cardCount: set.cardCount.total,
              serieId: serieResume.id,
            },
          }),
        `collection ${set.id}`,
      );

      console.log(
        `  Set: ${set.name} — ${set.cards.length} cartas${usedFallback ? " (sem tradução pt, usando en)" : ""}`,
      );

      // 5. Cada carta dentro do set já vem com id, nome, número e imagem
      // (não precisa buscar carta por carta pra isso — só pro preço)
      for (const cardResume of set.cards) {
        await withRetry(
          () =>
            prisma.card.upsert({
              where: { id: cardResume.id },
              update: {
                name: cardResume.name ?? "Desconhecida",
                localId: cardResume.localId,
                image: cardResume.image ?? null,
                collectionId: set.id,
              },
              create: {
                id: cardResume.id,
                name: cardResume.name ?? "Desconhecida",
                localId: cardResume.localId,
                image: cardResume.image ?? null,
                collectionId: set.id,
              },
            }),
          `card ${cardResume.id}`,
        );
      }

      // Marca esse set como concluído e salva o checkpoint no disco
      // imediatamente — se cair logo depois, não perde esse set já feito.
      done.add(setResume.id);
      saveCheckpoint(done);

      // Pausa curta entre sets, pra não fazer requisições em rajada
      await sleep(200);
    }
  }

  console.log("\nSincronização concluída!");
}

main()
  .catch((err) => {
    console.error("Erro durante a sincronização:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
