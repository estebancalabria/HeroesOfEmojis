import { Board } from "./board.js";
import { TileColor } from "./tile.js";

// Crear tablero 20x20
const board = new Board(20, 20);

// Ejemplos de emojis
board.get(0, 0)!.emoji = "🌲";
board.get(1, 0)!.emoji = "🌲";
board.get(5, 5)!.emoji = "🏰";

// Crear una laguna (solo color, sin gradientes)
const waterTiles: [number, number][] = [
  [10, 10], [10, 11],
  [11, 10], [11, 11]
];
for (const [x, y] of waterTiles) {
  const t = board.get(x, y)!;
  t.type = "water";
  t.color = TileColor["water"];
}

/**
 * Devuelve el color base del tile (sin efectos visuales)
 */
function getTileBackground(x: number, y: number): string {
  const tile = board.get(x, y)!;
  return tile.color;
}

/**
 * Renderiza el tablero
 */
function renderBoard(containerId: string) {
  const container = document.getElementById(containerId)!;
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${board.width}, 38px)`;

  for (const row of board.tiles) {
    for (const tile of row) {
      const div = document.createElement("div");
      div.className = "tile";

      // Fondo plano según el color del tile
      div.style.backgroundColor = getTileBackground(tile.x, tile.y);
      div.textContent = tile.emoji ?? "";

      div.addEventListener("click", () => {
        alert(`Coordenada: (${tile.x}, ${tile.y})`);
      });

      container.appendChild(div);
    }
  }
}

renderBoard("board");
