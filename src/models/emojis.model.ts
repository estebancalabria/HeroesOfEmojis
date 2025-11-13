// Definimos el tipo para los emojis
type EmojiMap = {
  readonly [category: string]: {
    readonly [type: string]: string; // Clave: string (nombre del tipo), Valor: emoji (string)
  };
};

// Creamos el objeto con identificadores como claves
export const EmojisModel = {
  TERRAIN: {
    TREE: "🌳",
    CHRISTMAS_TREE: "🎄",
    MOUNTAIN: "⛰️",
    VOLCANO: "🌋",
    TROPHY: "🏆" // Este es el de TERRAIN
  },
  CASTLES: {
    RED_CASTLE: "🏰",
    BLUE_CASTLE: "🏯"
  },
  PLACES: {
    HOUSE: "🏠",
    SHRINE: "⛩️",
    HUT: "🛖",
    GRAVE: "🪦",
    COFFIN: "⚰️",
    TEMPLE: "🕋",
    SNOWMAN: "☃️"
  },
  RESOURCES: {
    GOLD: "💰",
    WOOD: "🪵",
    STONE: "🪨"
  },
  ITEMS: {
    TROPHY: "🏆", // Este es el de ITEMS
    GOLD_MEDAL: "🥇",
    AMULET: "🪬",
    BOW: "🏹",
    SWORD: "🗡️",
    DAGGER: "🔪",
    BOOMERANG: "🪃"
  },
  ARMY: {
    SOLDIER: "🪖"
  },
  HEROES: {
    KNIGHT: "🤺"
  },
  DIRECTIONS: {
    RIGHT: "➡️",
    LEFT: "⬅️",
    UP: "⬆️",
    DOWN: "⬇️",
    UP_RIGHT: "↗️",
    DOWN_RIGHT: "↘️",
    DOWN_LEFT: "↙️",
    UP_LEFT: "↖️"
  }
} as const; // <-- `as const` es clave aquí

// Para acceder: Emojis.TERRAIN.TREE -> "🌳"
// TypeScript infiere que `Emojis.TERRAIN.TREE` es literalmente "🌳"
// Y que `Emojis.TERRAIN` es un objeto con solo esas claves específicas.

//🗿🏚️🏠🏠🏡🏡⛪⛪🕌🕌🛕🛕🕍🕍⛩️🏥🏥🏫🏫🏯🏯🏰🏰💒💒⛲⛲⛺⛺🌊❄️