// components/BoardComponent.ts
import { BoardModel } from "../../models/board.model.js";
import { EmojisModel } from "../../models/emojis.model.js";
import { TileTypes } from "../../models/tile.model.js";
import { enableDragScroll } from "./Board.drag-scroll.js";


export class BoardComponent extends HTMLElement {
  private board: BoardModel;
  private selectedStartTile: { x: number; y: number } | null = null;
  private pathElement: HTMLElement | null = null;

  constructor() {
    super();
    this.board = new BoardModel(20, 20);
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Configuración inicial del tablero similar a tu código
    this.board.get(0, 0)!.emoji = "🌲";
    this.board.get(1, 0)!.emoji = "🌲";

    const castleStartX = 5;
    const castleStartY = 5;
    const castleSize = 5;
    const castleEmoji = "🏰";
    const castleGroupId = "Player_1_Castle";

    for (let y = castleStartY; y < castleStartY + castleSize; y++) {
      for (let x = castleStartX; x < castleStartX + castleSize; x++) {
        const tile = this.board.get(x, y);
        if (tile) {
          tile.emoji = castleEmoji;
          tile.groupId = castleGroupId;
        }
      }
    }

    const waterTiles: [number, number][] = [
      [10, 10], [10, 11],
      [11, 10], [11, 11]
    ];
    for (const [x, y] of waterTiles) {
      const t = this.board.get(x, y)!;
      t.type = TileTypes.WATER;
    }
  }

  connectedCallback() {
    this.render();
    const wrapper = this.querySelector("#board-wrapper") as HTMLElement;
    if (wrapper) enableDragScroll(wrapper);
  }


  private render(): void {
    this.innerHTML = `
  <div id="board-wrapper" style="
      width:100%;
      height:100%;
      overflow:auto;
      position:relative;

      /* Scroll verde */
      scrollbar-width: thin;
      scrollbar-color: green transparent;
  ">
      <div id="board-container" style="
        position: relative;
        display: grid;
        grid-template-columns: repeat(20, 38px);
        gap: 0px;
        background: #181a1f;
        padding: 4px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        cursor: grab;
      ">
      </div>
  </div>
`;

    this.renderBoard();

  }

  private renderBoard(): void {
    const container = this.querySelector("#board-container")! as HTMLElement;
    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${this.board.width}, 38px)`;
    container.style.position = "relative";

    const groups = new Map<string, { tiles: any[]; min_x: number; max_x: number; min_y: number; max_y: number }>();

    for (const row of this.board.tiles) {
      for (const tile of row) {
        if (tile.groupId) {
          if (!groups.has(tile.groupId)) {
            groups.set(tile.groupId, {
              tiles: [],
              min_x: tile.x,
              max_x: tile.x,
              min_y: tile.y,
              max_y: tile.y,
            });
          }
          const group = groups.get(tile.groupId)!;
          group.tiles.push(tile);
          group.min_x = Math.min(group.min_x, tile.x);
          group.max_x = Math.max(group.max_x, tile.x);
          group.min_y = Math.min(group.min_y, tile.y);
          group.max_y = Math.max(group.max_y, tile.y);
        }
      }
    }

    for (const row of this.board.tiles) {
      for (const tile of row) {
        const div = document.createElement("div");
        div.className = "tile";
        div.style.backgroundColor = tile.color;
        div.style.width = "38px";
        div.style.height = "38px";
        div.style.display = "grid";
        div.style.placeItems = "center";
        div.style.fontSize = "20px";
        div.style.borderRadius = "0px";
        div.style.userSelect = "none";
        div.style.transition = "transform 0.1s ease, filter 0.1s ease";
        div.style.position = "relative";

        if (!tile.groupId && tile.emoji) {
          div.textContent = tile.emoji;
        }

        div.addEventListener("click", () => {
          const clickedX = tile.x;
          const clickedY = tile.y;

          if (this.selectedStartTile === null) {
            this.selectedStartTile = { x: clickedX, y: clickedY };
            console.log(`Punto de inicio seleccionado: (${clickedX}, ${clickedY})`);
            return;
          }

          const start = this.selectedStartTile;
          const goal = { x: clickedX, y: clickedY };

          if (this.pathElement) {
            container.removeChild(this.pathElement);
            this.pathElement = null;
          }
          const existingArrowContainer = container.querySelector('#arrows-overlay');
          if (existingArrowContainer) {
            container.removeChild(existingArrowContainer);
          }

          const transitableMatrix = this.board.getTransitableMatrix();
          const path = this.board.aStar(transitableMatrix, start, goal);

          if (path && path.length > 0) {
            console.log("Camino encontrado:", path);
            this.drawArrowsForPath(container, path);
          } else {
            console.log("No se encontró un camino.");
            const existingArrowContainer = container.querySelector('#arrows-overlay');
            if (existingArrowContainer) {
              container.removeChild(existingArrowContainer);
            }
          }

          this.selectedStartTile = null;
        });

        container.appendChild(div);
      }
    }

    groups.forEach((groupData, groupId) => {
      const firstEmoji = groupData.tiles[0].emoji;
      if (!firstEmoji) return;

      const groupDiv = document.createElement("div");
      groupDiv.className = "tile-group";
      groupDiv.textContent = firstEmoji;

      const width = (groupData.max_x - groupData.min_x + 1) * 38;
      const height = (groupData.max_y - groupData.min_y + 1) * 38;
      const left = groupData.min_x * 38;
      const top = groupData.min_y * 38;

      groupDiv.style.position = "absolute";
      groupDiv.style.left = `${left}px`;
      groupDiv.style.top = `${top}px`;
      groupDiv.style.width = `${width}px`;
      groupDiv.style.height = `${height}px`;
      groupDiv.style.display = "flex";
      groupDiv.style.alignItems = "center";
      groupDiv.style.justifyContent = "center";
      groupDiv.style.fontSize = `${Math.min(width, height) * 0.6}px`;
      groupDiv.style.pointerEvents = "none";

      container.appendChild(groupDiv);
    });
  }

  private drawArrowsForPath(
    container: HTMLElement,
    path: { x: number; y: number }[],
    tileWidth: number = 38,
    tileHeight: number = 38
  ): void {
    const existingArrowContainer = container.querySelector('#arrows-overlay');
    if (existingArrowContainer) {
      container.removeChild(existingArrowContainer);
    }

    if (path.length === 0) return;

    const arrowContainer = document.createElement("div");
    arrowContainer.id = "arrows-overlay";
    arrowContainer.style.position = "absolute";
    arrowContainer.style.top = "0";
    arrowContainer.style.left = "0";
    arrowContainer.style.width = "100%";
    arrowContainer.style.height = "100%";
    arrowContainer.style.pointerEvents = "none";
    arrowContainer.style.zIndex = "10";

    for (let i = 1; i < path.length; i++) {
      const prevPoint = path[i - 1];
      const currentPoint = path[i];

      const dx = currentPoint.x - prevPoint.x;
      const dy = currentPoint.y - prevPoint.y;

      let directionKey: string | null = null;
      if (dx === 1 && dy === 0) {
        directionKey = "RIGHT";
      } else if (dx === -1 && dy === 0) {
        directionKey = "LEFT";
      } else if (dx === 0 && dy === -1) {
        directionKey = "UP";
      } else if (dx === 0 && dy === 1) {
        directionKey = "DOWN";
      } else if (dx === 1 && dy === -1) {
        directionKey = "UP_RIGHT";
      } else if (dx === 1 && dy === 1) {
        directionKey = "DOWN_RIGHT";
      } else if (dx === -1 && dy === 1) {
        directionKey = "DOWN_LEFT";
      } else if (dx === -1 && dy === -1) {
        directionKey = "UP_LEFT";
      } else {
        console.warn(`Dirección no reconocida entre (${prevPoint.x},${prevPoint.y}) y (${currentPoint.x},${currentPoint.y})`);
        continue;
      }

      const arrowTile = document.createElement("div");
      arrowTile.style.position = "absolute";
      arrowTile.style.width = `${tileWidth}px`;
      arrowTile.style.height = `${tileHeight}px`;
      arrowTile.style.left = `${prevPoint.x * tileWidth}px`;
      arrowTile.style.top = `${prevPoint.y * tileHeight}px`;
      arrowTile.style.display = "flex";
      arrowTile.style.alignItems = "center";
      arrowTile.style.justifyContent = "center";
      arrowTile.style.fontSize = "24px";
      arrowTile.style.color = "rgba(0, 0, 255, 0.7)";
      arrowTile.style.fontFamily = "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
      arrowTile.style.textAlign = "center";
      arrowTile.style.lineHeight = `${tileHeight}px`;

      const emoji = EmojisModel.DIRECTIONS[directionKey as keyof typeof EmojisModel.DIRECTIONS];
      if (emoji) {
        arrowTile.textContent = emoji;
      } else {
        arrowTile.textContent = "?";
      }

      arrowContainer.appendChild(arrowTile);
    }

    container.appendChild(arrowContainer);
  }

  static get observedAttributes(): string[] {
    return [];
  }


}

