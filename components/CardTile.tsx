// components/CardTile.tsx
import type { MockCard } from "@/lib/mock-data";

export function CardTile({
  card,
  onClick,
}: {
  card: MockCard;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-left transition-all hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[63/88] overflow-hidden rounded-lg bg-black/30">
        <img
          src={card.image}
          alt={card.name}
          className="h-full w-full object-cover transition-all duration-500"
          style={{ filter: card.owned ? "none" : "grayscale(1) opacity(0.35)" }}
        />
        {card.isFoil && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(139,92,246,0.35)_45%,rgba(34,211,238,0.35)_50%,rgba(245,166,35,0.35)_55%,transparent_70%)] bg-[length:250%_250%] animate-[holoSweep_2.5s_linear_infinite]" />
        )}
        {card.owned && card.quantity > 1 && (
          <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white/90">
            x{card.quantity}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-1">
        <p className="truncate text-xs text-white/80">{card.name}</p>
        <p className="shrink-0 font-mono text-[10px] text-white/40">
          #{card.localId}
        </p>
      </div>
    </button>
  );
}
