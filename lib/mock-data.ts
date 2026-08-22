// lib/mock-data.ts
//
// Dados falsos só pra construir o visual. Na Fase 6 você troca essas
// funções por chamadas reais ao Prisma / API routes.

export type MockCard = {
  id: string;
  localId: string;
  name: string;
  image: string;
  owned: boolean;
  quantity: number;
  isFoil: boolean;
};

export type MockCollection = {
  id: string;
  name: string;
  serieId: string;
  serieName: string;
  logo: string;
  cardCount: number;
  ownedCount: number;
};

export const mockSeries = [
  { id: "sv", name: "Escarlate e Violeta" },
  { id: "swsh", name: "Espada e Escudo" },
  { id: "sm", name: "Sol e Lua" },
];

export const mockCollections: MockCollection[] = [
  {
    id: "sv03",
    name: "Obsidiana em Chamas",
    serieId: "sv",
    serieName: "Escarlate e Violeta",
    logo: "https://assets.tcgdex.net/pt-br/sv/sv03/logo.png",
    cardCount: 230,
    ownedCount: 187,
  },
  {
    id: "sv04",
    name: "151",
    serieId: "sv",
    serieName: "Escarlate e Violeta",
    logo: "https://assets.tcgdex.net/pt-br/sv/sv04/logo.png",
    cardCount: 207,
    ownedCount: 207,
  },
  {
    id: "sv02",
    name: "Evoluções em Paldea",
    serieId: "sv",
    serieName: "Escarlate e Violeta",
    logo: "https://assets.tcgdex.net/pt-br/sv/sv02/logo.png",
    cardCount: 279,
    ownedCount: 42,
  },
  {
    id: "swsh12",
    name: "Realeza Absoluta",
    serieId: "swsh",
    serieName: "Espada e Escudo",
    logo: "https://assets.tcgdex.net/pt-br/swsh/swsh12/logo.png",
    cardCount: 160,
    ownedCount: 0,
  },
  {
    id: "swsh8",
    name: "Estilos de Batalha",
    serieId: "swsh",
    serieName: "Espada e Escudo",
    logo: "https://assets.tcgdex.net/pt-br/swsh/swsh8/logo.png",
    cardCount: 183,
    ownedCount: 9,
  },
  {
    id: "sm12",
    name: "Eclipse Cósmico",
    serieId: "sm",
    serieName: "Sol e Lua",
    logo: "https://assets.tcgdex.net/pt-br/sm/sm12/logo.png",
    cardCount: 271,
    ownedCount: 0,
  },
];

// Cartas de exemplo pra tela de detalhe de uma coleção (sv03)
export const mockCardsBySet: Record<string, MockCard[]> = {
  sv03: Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    const owned = n % 3 !== 0; // ~2/3 marcadas, só pra variar visualmente
    return {
      id: `sv03-${n}`,
      localId: String(n).padStart(3, "0"),
      name: [
        "Pineco",
        "Heracross",
        "Shroomish",
        "Breloom",
        "Cacnea",
        "Cacturne",
        "Charmander",
        "Charmeleon",
        "Charizard",
        "Growlithe",
      ][i % 10],
      image: `https://assets.tcgdex.net/pt-br/sv/sv03/${n}/high.png`,
      owned,
      quantity: owned ? Math.ceil(Math.random() * 3) : 0,
      isFoil: owned && n % 5 === 0,
    };
  }),
};

// Cartas usadas na prévia de busca por nome (várias numerações do mesmo nome)
export const mockCardSearchResults: MockCard[] = [
  {
    id: "sv03-6",
    localId: "006",
    name: "Charizard",
    image: "https://assets.tcgdex.net/pt-br/sv/sv03/6/high.png",
    owned: true,
    quantity: 1,
    isFoil: true,
  },
  {
    id: "sv03-125",
    localId: "125",
    name: "Charizard ex",
    image: "https://assets.tcgdex.net/pt-br/sv/sv03/125/high.png",
    owned: false,
    quantity: 0,
    isFoil: false,
  },
  {
    id: "sv04-6",
    localId: "006",
    name: "Charizard",
    image: "https://assets.tcgdex.net/pt-br/sv/sv04/6/high.png",
    owned: true,
    quantity: 2,
    isFoil: false,
  },
  {
    id: "base1-4",
    localId: "004",
    name: "Charizard",
    image: "https://assets.tcgdex.net/pt-br/base1/4/high.png",
    owned: false,
    quantity: 0,
    isFoil: false,
  },
];
