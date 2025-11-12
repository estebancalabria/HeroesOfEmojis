// board.ts
import { Tile, TileType, TileColor } from "./tile.js";

/**
 * Representa el tablero completo (grid de tiles)
 */
export class Board {
  width: number;
  height: number;
  tiles: Tile[][];

  constructor(width: number, height: number, defaultType: TileType = "grass") {
    this.width = width;
    this.height = height;
    this.tiles = [];

    // Crear matriz base
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push({
          x,
          y,
          type: defaultType,
          color: TileColor[defaultType],
          emoji: null,
        });
      }
      this.tiles.push(row);
    }
  }

  /** Obtiene un tile seguro (null si está fuera de rango) */
  get(x: number, y: number): Tile | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.tiles[y][x];
  }

  /** Vecinos ortogonales (N, S, E, O) */
  getNeighbors(tile: Tile): Tile[] {
    const dirs = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];
    return dirs
      .map(([dx, dy]) => this.get(tile.x + dx, tile.y + dy))
      .filter((t): t is Tile => t !== null);
  }

  /** Asigna emojis agrupando regiones iguales */
  /*groupEmojis(): void {
    let groupId = 1;
    const visited = new Set<string>();

    const floodFill = (start: Tile, emoji: string) => {
      const stack = [start];
      while (stack.length > 0) {
        const current = stack.pop()!;
        const key = `${current.x},${current.y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        current.groupId = groupId;

        // Buscar vecinos con el mismo emoji
        for (const n of this.getNeighbors(current)) {
          if (n.emoji === emoji && !visited.has(`${n.x},${n.y}`)) {
            stack.push(n);
          }
        }
      }
    };

    // Resetear grupos
    for (const row of this.tiles) {
      for (const t of row) t.groupId = null;
    }

    // Buscar regiones contiguas con el mismo emoji
    for (const row of this.tiles) {
      for (const t of row) {
        if (!t.emoji) continue;
        const key = `${t.x},${t.y}`;
        if (visited.has(key)) continue;
        floodFill(t, t.emoji);
        groupId++;
      }
    }
  }*/

  /** Devuelve todos los tiles planos */
  flatten(): Tile[] {
    return this.tiles.flat();
  }

  /** Muestra el tablero en consola (solo debug) */
  print(): void {
    const rows = this.tiles.map((r) =>
      r.map((t) => (t.emoji ? t.emoji : "⬜")).join("")
    );
    console.log(rows.join("\n"));
  }
}
