"use client";
// app/colecoes/[setId]/page.tsx
//
// Visual apenas — abre/fecha o painel de detalhe da carta no cliente.
// Na Fase 6: buscar as cartas reais do set via params.setId, e persistir
// as mudanças do CardDetailSheet no banco.

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockCardsBySet, mockCollections } from "@/lib/mock-data";
import { CardTile } from "@/components/CardTile";
import { CardDetailSheet } from "@/components/CardDetailSheet";
import { ProgressBar } from "@/components/ProgressBar";
import type { MockCard } from "@/lib/mock-data";

export default function CollectionDetailPage() {
  const params = useParams<{ setId: string }>();
  const collection = mockCollections.find((c) => c.id === params.setId);
  const cards = mockCardsBySet[params.setId] ?? [];
  const [selectedCard, setSelectedCard] = useState<MockCard | null>(null);

  if (!collection) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14121F] text-white/50">
        Coleção não encontrada.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#14121F] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/" className="text-xs text-white/40 hover:text-white/70">
          ← voltar
        </Link>

        <header className="mt-3 mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            {collection.serieName}
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
            {collection.name}
          </h1>
          <div className="mt-3 flex items-center gap-3 max-w-xs">
            <ProgressBar
              owned={collection.ownedCount}
              total={collection.cardCount}
            />
            <span className="shrink-0 font-mono text-xs text-white/50">
              {collection.ownedCount}/{collection.cardCount}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {cards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              onClick={() => setSelectedCard(card)}
            />
          ))}
        </div>
      </div>

      {selectedCard && (
        <CardDetailSheet
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </main>
  );
}
