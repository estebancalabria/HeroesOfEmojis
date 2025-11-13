// board.ts
import {  TileModel, TileType, TileTypes } from "./tile.model.js";
import { PointModel } from "./point.model.js";

/**
 * Representa el tablero completo (grid de tiles)
 */
export class BoardModel {
  width: number;
  height: number;
  tiles: TileModel[][];

  constructor(width: number, height: number, defaultType: TileType = TileTypes.GRASS) {
    this.width = width;
    this.height = height;
    this.tiles = [];

    // Crear matriz base
    for (let y = 0; y < height; y++) {
      const row: TileModel[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new TileModel(
          x,
          y,
          defaultType,
          null,
        ));
      }
      this.tiles.push(row);
    }
  }

  /** Obtiene un tile seguro (null si está fuera de rango) */
  get(x: number, y: number): TileModel | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return null;
    return this.tiles[y][x];
  }

  /** Vecinos ortogonales (N, S, E, O) */
  getNeighbors(tile: TileModel): TileModel[] {
    const dirs = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];
    return dirs
      .map(([dx, dy]) => this.get(tile.x + dx, tile.y + dy))
      .filter((t): t is TileModel => t !== null);
  }


  /** Devuelve todos los tiles planos */
  flatten(): TileModel[] {
    return this.tiles.flat();
  }

  /** Muestra el tablero en consola (solo debug) */
  print(): void {
    const rows = this.tiles.map((r) =>
      r.map((t) => (t.emoji ? t.emoji : "⬜")).join("")
    );
    console.log(rows.join("\n"));
  }

  /** Devuelve una matriz de booleanos donde true indica que la celda es transitable y false que no lo es */
  getTransitableMatrix(): boolean[][] {
    return this.tiles.map(row =>
      row.map(tile => {
        // Consideramos transitables todos los tipos excepto agua y montaña
        // Puedes ajustar esta lógica según tus reglas de juego
        return tile.transitable;
      })
    );
  }

  aStar(grid: boolean[][], start: PointModel, goal: PointModel): PointModel[] | null {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions: PointModel[] = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, // cardinales
      { x: 1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 } // diagonales
    ];

    const heuristic = (a: PointModel, b: PointModel) =>
      Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); // Chebyshev

    const cameFrom = new Map<string, string>();
    const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    gScore[start.y][start.x] = 0;
    fScore[start.y][start.x] = heuristic(start, goal);

    const openSet: PointModel[] = [start];
    const key = (p: PointModel) => `${p.x},${p.y}`;

    function canMoveDiagonal(cx: number, cy: number, nx: number, ny: number): boolean {
      const dx = nx - cx;
      const dy = ny - cy;

      // No es diagonal → dejar pasar
      if (Math.abs(dx) !== 1 || Math.abs(dy) !== 1) return true;

      // Si es diagonal, chequeamos las dos casillas cardinales
      const cell1 = grid[cy][cx + dx];     // horizontal
      const cell2 = grid[cy + dy][cx];     // vertical

      return cell1 && cell2; // ambas deben ser transitables
    }

    while (openSet.length > 0) {
      openSet.sort((a, b) => fScore[a.y][a.x] - fScore[b.y][b.x]);
      const current = openSet.shift()!;

      if (current.x === goal.x && current.y === goal.y) {
        const path: PointModel[] = [];
        let k = key(current);

        while (k !== key(start)) {
          const [x, y] = k.split(',').map(Number);
          path.push({ x, y });
          k = cameFrom.get(k)!;
        }
        path.push(start);
        return path.reverse();
      }

      for (const dir of directions) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;

        if (
          nx < 0 || nx >= cols ||
          ny < 0 || ny >= rows ||
          !grid[ny][nx]
        ) continue;

        // Chequeo de diagonal no-clipeada
        if (!canMoveDiagonal(current.x, current.y, nx, ny)) continue;

        const tentativeG = gScore[current.y][current.x] + 1;

        if (tentativeG < gScore[ny][nx]) {
          cameFrom.set(key({ x: nx, y: ny }), key(current));
          gScore[ny][nx] = tentativeG;
          fScore[ny][nx] = tentativeG + heuristic({ x: nx, y: ny }, goal);

          if (!openSet.some(p => p.x === nx && p.y === ny)) {
            openSet.push({ x: nx, y: ny });
          }
        }
      }
    }

    return null;
  }

}
