import {
  Cow,
  Grass,
  Wolf,
  type Board,
  type Cell,
  type Creature,
} from "./creatures";

export class CanvasRenderer {
  public ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public board: Board) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    this.ctx = ctx;
  }

  get columnWidth() {
    return this.canvas.width / this.board.width;
  }
  get rowHeight() {
    return this.canvas.height / this.board.height;
  }

  renderGrid() {
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (
      let x = this.columnWidth;
      x < this.canvas.width;
      x += this.columnWidth
    ) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }
    for (let y = this.rowHeight; y < this.canvas.height; y += this.rowHeight) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }
    this.ctx.stroke();
  }

  renderGrass(position: { x: number; y: number }) {
    this.renderRect(position, "green");
  }
  renderCow(position: { x: number; y: number }) {
    this.renderCircle(position, "brown");
  }
  renderWolf(position: { x: number; y: number }) {
    this.renderCircle(position, "black");
  }

  renderCross(position: { x: number; y: number }, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(position.x * this.columnWidth, position.y * this.rowHeight);
    this.ctx.lineTo(
      (position.x + 1) * this.columnWidth,
      (position.y + 1) * this.rowHeight
    );
    this.ctx.moveTo(
      (position.x + 1) * this.columnWidth,
      position.y * this.rowHeight
    );
    this.ctx.lineTo(
      position.x * this.columnWidth,
      (position.y + 1) * this.rowHeight
    );
    this.ctx.stroke();
  }
  renderCircle(position: { x: number; y: number }, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(
      position.x * this.columnWidth + this.columnWidth / 2,
      position.y * this.rowHeight + this.rowHeight / 2,
      10,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }
  renderRect(position: { x: number; y: number }, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      position.x * this.columnWidth,
      position.y * this.rowHeight,
      this.columnWidth,
      this.rowHeight
    );
  }

  renderCell(cell: Cell, position: { x: number; y: number }) {
    if (cell.creatures.length > 1) {
      return this.renderCross(position, "red");
    }

    if (cell.creatures[0] instanceof Grass) {
      this.renderGrass(position);
    } else if (cell.creatures[0] instanceof Cow) {
      this.renderCow(position);
    } else if (cell.creatures[0] instanceof Wolf) {
      this.renderWolf(position);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderGrid();
    for (const [x, row] of this.board.map.map) {
      for (const [y, cell] of row.map) {
        this.renderCell(cell, { x, y });
      }
    }
  }
}
