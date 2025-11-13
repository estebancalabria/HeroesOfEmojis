
export interface TileType {
    name: string;
    color: string;
    transitable: boolean;
}

export const TileTypes  ={
    GRASS: {
        name: "grass",
        color: "#7CFC00",
        transitable: true,
    } as TileType,
    WATER: {
        name: "water",
        color: "#1E90FF",
        transitable: false, // NO transitable
    } as TileType,
    FOREST: {
        name: "forest",
        color: "#228B22",
        transitable: true,
    } as TileType,
    MOUNTAIN: {
        name: "mountain",
        color: "#A9A9A9",
        transitable: true,
    } as TileType,
    SAND: {
        name: "sand",
        color: "#F4A460",
        transitable: true,
    } as TileType,
    CASTLE: {
        name: "castle",
        color: "#808080",
        transitable: true,
    } as TileType,
    SNOW: {
        name: "snow",
        color: "#FFFAFA",
        transitable: true,
    } as TileType,
} as const;


export class TileModel {
  x: number;
  y: number;
  type: TileType;
  emoji?: string | null;
  groupId?: string;

  constructor(x: number, y: number, type: TileType, emoji?: string | null, groupId?: string) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.emoji = emoji;
    this.groupId = groupId;
  }

  get transitable(): boolean {
    return !this.emoji && this.type.transitable; 
  }

  get color(): string {
    return this.type.color;
  }
}