
export type TileType =
    | "grass"
    | "water"
    | "forest"
    | "mountain"
    | "sand"
    | "castle"
    | "snow";

export const TileColor: Record<TileType, string> = {
  grass: "#a7d46f",
  water: "#4aa0e0",
  forest: "#3a8a53",
  mountain: "#9ca6b1",
  sand: "#e8c77d",
  castle: "#b8c1ff",
  snow: "#e0f0ff",
};

export interface Tile {
    x: number;
    y: number;
    type: TileType;
    color: string;
    emoji?: string | null;
}