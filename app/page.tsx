"use client";
// app/page.tsx
//
// Visual apenas — os estados de busca/filtro/ordenação já funcionam no
// cliente sobre os dados mockados. Na Fase 6 você troca mockCollections
// por dados vindos do servidor (Server Component + fetch ao Prisma).

import { useMemo, useState } from "react";
import { mockCollections, mockSeries } from "@/lib/mock-data";
import { CollectionCard } from "@/components/CollectionCard";
import { CardSearchPreview } from "@/components/CardSearchPreview";

type SortMode = "default" | "most-owned" | "least-owned";

export default function HomePage() {
  const [setQuery, setSetQuery] = useState("");
  const [cardQuery, setCardQuery] = useState("");
  const [serieFilter, setSerieFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");

  const filteredCollections = useMemo(() => {
    let result = mockCollections.filter((c) => {
      const matchesSerie = serieFilter === "all" || c.serieId === serieFilter;
      const matchesQuery =
        setQuery.trim() === "" ||
        c.name.toLowerCase().includes(setQuery.toLowerCase()) ||
        c.serieName.toLowerCase().includes(setQuery.toLowerCase());
      return matchesSerie && matchesQuery;
    });

    if (sortMode === "most-owned") {
      result = [...result].sort((a, b) => b.ownedCount - a.ownedCount);
    } else if (sortMode === "least-owned") {
      result = [...result].sort((a, b) => a.ownedCount - b.ownedCount);
    }

    return result;
  }, [setQuery, serieFilter, sortMode]);

  return (
    <main className="min-h-screen bg-[#14121F] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            álbum de figurinhas
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
            Sua coleção Pokémon
          </h1>
        </header>

        {/* Busca de carta específica, com prévia mostrando numeração */}
        <div className="relative mb-4 max-w-md">
          <input
            value={cardQuery}
            onChange={(e) => setCardQuery(e.target.value)}
            placeholder="Buscar uma carta pelo nome..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          />
          <CardSearchPreview query={cardQuery} />
        </div>

        {/* Busca de set/série + filtro + ordenação */}
        <div className="mb-8 flex flex-wrap gap-3">
          <input
            value={setQuery}
            onChange={(e) => setSetQuery(e.target.value)}
            placeholder="Buscar coleção ou série..."
            className="flex-1 min-w-[200px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          />

          <select
            value={serieFilter}
            onChange={(e) => setSerieFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          >
            <option value="all">Todas as séries</option>
            {mockSeries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          >
            <option value="default">Ordem padrão</option>
            <option value="most-owned">Mais cartas primeiro</option>
            <option value="least-owned">Menos cartas primeiro</option>
          </select>
        </div>

        {/* Grid de coleções */}
        {filteredCollections.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredCollections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-white/40">
            Nenhuma coleção encontrada com esses filtros.
          </p>
        )}
      </div>
    </main>
  );
}
