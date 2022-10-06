export function useCanvas(
  canvas: HTMLCanvasElement,
  cols: number,
  rows: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No canvas context");
  }

  const colwidth = canvas.width / cols;
  const rowheight = canvas.height / rows;

  const drawGrid = () => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = colwidth; x < canvas.width; x += colwidth) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = rowheight; y < canvas.height; y += rowheight) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
  };

  const drawLine = (
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) => {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(
      from.x * colwidth + colwidth / 2,
      from.y * rowheight + rowheight / 2
    );
    ctx.lineTo(
      to.x * colwidth + colwidth / 2,
      to.y * rowheight + rowheight / 2
    );
    ctx.stroke();
  };

  const drawCircle = (x: number, y: number) => {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
      x * colwidth + colwidth / 2,
      y * rowheight + rowheight / 2,
      10,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const reset = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return { drawGrid, drawLine, drawCircle, reset };
}
