export class AgentFood {
    constructor(model, x, y) {
        this.model = model;
        this.gridX = x;
        this.gridY = y;
        this.posX = x;
        this.posY = y;
    }

    draw(ctx, cellSize) {
        ctx.beginPath();
        ctx.arc(this.posX * cellSize + cellSize / 2, this.posY * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}
