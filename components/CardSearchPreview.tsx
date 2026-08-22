// components/CardSearchPreview.tsx
import { mockCardSearchResults } from "@/lib/mock-data";

// Visual apenas: no futuro, essa lista viria filtrada de verdade
// conforme o usuário digita (com debounce) numa Server Action ou API route.
export function CardSearchPreview({ query }: { query: string }) {
  if (!query) return null;

  return (
    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1830] shadow-xl shadow-black/40">
      <ul className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {mockCardSearchResults.map((card) => (
          <li
            key={card.id}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors"
          >
            <img
              src={card.image}
              alt={card.name}
              className="h-12 w-12 rounded-lg object-cover bg-black/30 shrink-0"
              style={{
                filter: card.owned ? "none" : "grayscale(1) opacity(0.4)",
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/90">{card.name}</p>
              <p className="font-mono text-xs text-white/40">#{card.localId}</p>
            </div>
            {card.owned ? (
              <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                tenho{card.isFoil ? " · foil" : ""}
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                falta
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
