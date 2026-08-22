// components/CardDetailSheet.tsx
import type { MockCard } from "@/lib/mock-data";

// Visual apenas: os handlers (onToggleOwned, onChangeQuantity, onToggleFoil)
// só recebem os valores por enquanto. Na Fase 6 você os conecta a Server
// Actions que fazem upsert em UserCard (owned, quantity, isFoil).
export function CardDetailSheet({
  card,
  onClose,
}: {
  card: MockCard;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-3xl border border-white/10 bg-[#1A1830] p-6 sm:rounded-3xl"
      >
        <div className="flex gap-4">
          <img
            src={card.image}
            alt={card.name}
            className="h-32 w-24 shrink-0 rounded-xl object-cover bg-black/30"
            style={{
              filter: card.owned ? "none" : "grayscale(1) opacity(0.4)",
            }}
          />
          <div>
            <p className="font-mono text-xs text-white/40">#{card.localId}</p>
            <h2 className="font-display text-lg font-medium text-white/95">
              {card.name}
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/80">Tenho essa carta</span>
            <input
              type="checkbox"
              defaultChecked={card.owned}
              className="h-5 w-5 accent-violet-500"
            />
          </label>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/80">Quantidade</span>
            <div className="flex items-center gap-3">
              <button className="h-7 w-7 rounded-full bg-white/10 text-sm hover:bg-white/20">
                −
              </button>
              <span className="w-4 text-center font-mono text-sm">
                {card.quantity || 1}
              </span>
              <button className="h-7 w-7 rounded-full bg-white/10 text-sm hover:bg-white/20">
                +
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/80">Versão foil</span>
            <input
              type="checkbox"
              defaultChecked={card.isFoil}
              className="h-5 w-5 accent-cyan-400"
            />
          </label>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-white/10 py-3 text-sm font-medium text-white/90 hover:bg-white/15"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
