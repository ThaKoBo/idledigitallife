import { AgentGroupA, AgentGroupB } from './agents.js';

export class SimulationModel {
    constructor(width, height, numAgents) {
        this.width = width;
        this.height = height;
        this.agents = [];
        this.foodGrid = Array.from({length: width}, () => Array(height).fill(0));
        this.nextId = 0;
        this.initFood();
        this.initAgents(numAgents);
        this.running = false;
    }

    initFood() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.foodGrid[x][y] = Math.floor(Math.random() * 11); // 0-10
            }
        }
    }

    initAgents(numAgents) {
        for (let i = 0; i < numAgents; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const group = Math.random() < 0.5 ? 'A' : 'B';
            const agent = group === 'A' ? new AgentGroupA(this.nextId++, this, x, y) : new AgentGroupB(this.nextId++, this, x, y);
            this.agents.push(agent);
        }
    }

    step() {
        // Shuffle agents เพื่อ random order
        const shuffled = [...this.agents].sort(() => Math.random() - 0.5);
        shuffled.forEach(agent => agent.step());

        // เติมอาหารใหม่
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (Math.random() < 0.1) {
                    this.foodGrid[x][y] += Math.floor(Math.random() * 5) + 1;
                }
            }
        }
    }

    draw(ctx, cellSize) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // วาดอาหาร (สีเขียวตามปริมาณ)
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.foodGrid[x][y] > 0) {
                    ctx.fillStyle = `rgba(0, 255, 0, ${this.foodGrid[x][y] / 10})`;
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }

        // วาด agents
        this.agents.forEach(agent => agent.draw(ctx, cellSize));
    }
}
