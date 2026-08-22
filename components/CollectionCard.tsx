// components/CollectionCard.tsx
import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import type { MockCollection } from "@/lib/mock-data";

export function CollectionCard({ collection }: { collection: MockCollection }) {
  const { id, name, logo, cardCount, ownedCount } = collection;
  const ratio = cardCount > 0 ? ownedCount / cardCount : 0;
  const isEmpty = ownedCount === 0;
  const isComplete = ownedCount >= cardCount && cardCount > 0;

  // satura a imagem conforme o progresso: 0% = cinza total, 100% = cor plena
  const saturation = 0.15 + ratio * 0.85;

  return (
    <Link
      href={`/colecoes/${id}`}
      className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
    >
      {/* varredura holográfica no hover — só quando já tem alguma carta */}
      {!isEmpty && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(115deg,transparent_35%,rgba(139,92,246,0.15)_45%,rgba(34,211,238,0.15)_50%,rgba(245,166,35,0.15)_55%,transparent_65%)] bg-[length:250%_250%] animate-[holoSweep_2.5s_linear_infinite]" />
      )}

      <div className="relative flex aspect-[4/3] items-center justify-center rounded-2xl bg-black/20 p-4">
        <img
          src={logo}
          alt={name}
          className="max-h-full max-w-full object-contain transition-all duration-700"
          style={{
            filter: `grayscale(${1 - saturation}) opacity(${isEmpty ? 0.35 : 0.55 + ratio * 0.45})`,
          }}
        />
        {isEmpty && (
          <span className="absolute bottom-2 right-2 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
            vazio
          </span>
        )}
        {isComplete && (
          <span className="absolute top-2 right-2 rounded-full bg-[linear-gradient(90deg,#8B5CF6,#22D3EE,#F5A623)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
            completo
          </span>
        )}
      </div>

      <div className="relative mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-sm font-medium text-white/90 truncate">
            {name}
          </h3>
          <span className="shrink-0 font-mono text-xs text-white/50 tabular-nums">
            {String(ownedCount).padStart(3, "0")}/
            {String(cardCount).padStart(3, "0")}
          </span>
        </div>
        <ProgressBar owned={ownedCount} total={cardCount} />
      </div>
    </Link>
  );
}
