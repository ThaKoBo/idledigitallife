import { AgentGroupA, AgentGroupB } from './agents.js';
import { AgentFood } from './agentFood.js';

export class SimulationModel {
    constructor(width, height, numAgents) {
        this.width = width;
        this.height = height;
        this.agents = [];
        this.foodAgents = [];
        this.nextId = 0;
        this.spawnAccumulator = 0;
        this.initFood();
        this.initAgents();
        this.running = false;
    }

    initFood() {
        for (let i = 0; i < 100; i++) { // เริ่มต้นด้วยอาหาร 100 ชิ้น
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            this.foodAgents.push(new AgentFood(this, x, y));
        }
    }

    initAgents() {
        // สร้าง AgentGroupA 2 ตัว (สีแดง)
        for (let i = 0; i < 2; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const agent = new AgentGroupA(this.nextId++, this, x, y);
            this.agents.push(agent);
        }
        // สร้าง AgentGroupB 2 ตัว (สีฟ้า)
        for (let i = 0; i < 2; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const agent = new AgentGroupB(this.nextId++, this, x, y);
            this.agents.push(agent);
        }
    }

    spawnFood(delta) {
        this.spawnAccumulator += delta;
        while (this.spawnAccumulator >= 0.5) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            this.foodAgents.push(new AgentFood(this, x, y));
            this.spawnAccumulator -= 0.5;
        }
    }

    getAgentsAt(x, y, group = null) {
        return this.agents.filter(a => a.gridX === x && a.gridY === y && (!group || a.group === group));
    }

    getFoodAt(x, y) {
        return this.foodAgents.filter(f => f.gridX === x && f.gridY === y);
    }

    step() {
        // Shuffle agents เพื่อ random order
        const shuffled = [...this.agents].sort(() => Math.random() - 0.5);
        shuffled.forEach(agent => agent.step());
    }

    updateAgents(delta) {
        this.agents.forEach(agent => agent.update(delta));
    }

    draw(ctx, cellSize) {
        // เติม background สีน้ำตาลอ่อน
        ctx.fillStyle = '#D2B48C'; // light brown
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // วาดอาหาร (AgentFood)
        this.foodAgents.forEach(food => food.draw(ctx, cellSize));

        // วาด agents
        this.agents.forEach(agent => agent.draw(ctx, cellSize));
    }
}
