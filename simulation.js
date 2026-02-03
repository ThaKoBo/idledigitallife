// คลาสพื้นฐานสำหรับ Agent
class CreatureAgent {
    constructor(id, model, x, y, group) {
        this.id = id;
        this.model = model;
        this.x = x;
        this.y = y;
        this.energy = Math.floor(Math.random() * 21) + 5; // 5-25
        this.vision = Math.floor(Math.random() * 6) + 1; // 1-6
        this.metabolism = Math.floor(Math.random() * 4) + 1; // 1-4
        this.group = group; // 'A' หรือ 'B'
    }

    step() {
        this.move(); // หาอาหาร
        this.eat(); // กิน
        this.energy -= this.metabolism; // เผาผลาญ
        if (this.energy < 0) {
            this.die();
        } else if (this.energy > 25) {
            this.reproduce();
        }
        this.fight(); // สู้รบ
    }

    move() {
        // หาตำแหน่งที่ดีที่สุดในวิสัยทัศน์ที่มีอาหารมากสุด
        let bestX = this.x;
        let bestY = this.y;
        let bestFood = 0;
        for (let dx = -this.vision; dx <= this.vision; dx++) {
            for (let dy = -this.vision; dy <= this.vision; dy++) {
                const nx = (this.x + dx + this.model.width) % this.model.width;
                const ny = (this.y + dy + this.model.height) % this.model.height;
                const food = this.model.foodGrid[nx][ny];
                if (food > bestFood) {
                    bestFood = food;
                    bestX = nx;
                    bestY = ny;
                }
            }
        }
        this.x = bestX;
        this.y = bestY;
    }

    eat() {
        const food = this.model.foodGrid[this.x][this.y];
        this.energy += food;
        this.model.foodGrid[this.x][this.y] = 0;
    }

    reproduce() {
        const child = this.createChild();
        child.energy = Math.floor(this.energy / 2);
        this.energy = Math.floor(this.energy / 2);
        child.x = this.x;
        child.y = this.y;
        this.model.agents.push(child);
    }

    fight() {
        // หา enemies ในตำแหน่งเดียวกัน
        const cellmates = this.model.agents.filter(a => a !== this && a.x === this.x && a.y === this.y && a.group !== this.group);
        if (cellmates.length > 0) {
            const enemy = cellmates[Math.floor(Math.random() * cellmates.length)];
            if (this.energy > enemy.energy) {
                this.energy += Math.floor(enemy.energy / 2);
                enemy.energy = 0;
            } else {
                enemy.energy += Math.floor(this.energy / 2);
                this.energy = 0;
            }
        }
    }

    die() {
        this.model.agents = this.model.agents.filter(a => a !== this);
    }

    // Method สำหรับ visualize (วาดใน canvas)
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x * 10 + 5, this.y * 10 + 5, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.group === 'A' ? 'blue' : 'red'; // แยกสีตามกลุ่ม
        ctx.fill();
    }

    // สำหรับ subclass เพื่อ create child
    createChild() {
        return new CreatureAgent(this.model.nextId++, this.model, this.x, this.y, this.group);
    }
}

// Subclass สำหรับ Group A (สามารถ customize เช่น vision สูงกว่า)
class AgentGroupA extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'A');
        this.vision += 1; // เพิ่ม vision สำหรับ Group A
    }

    createChild() {
        return new AgentGroupA(this.model.nextId++, this.model, this.x, this.y);
    }
}

// Subclass สำหรับ Group B (สามารถ customize เช่น metabolism ต่ำกว่า)
class AgentGroupB extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'B');
        this.metabolism -= 1; // ลด metabolism ถ้า >1
        if (this.metabolism < 1) this.metabolism = 1;
    }

    createChild() {
        return new AgentGroupB(this.model.nextId++, this.model, this.x, this.y);
    }
}

// คลาสสำหรับ Model (โลก)
class SimulationModel {
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

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // วาดอาหาร (สีเขียวตามปริมาณ)
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.foodGrid[x][y] > 0) {
                    ctx.fillStyle = `rgba(0, 255, 0, ${this.foodGrid[x][y] / 10})`;
                    ctx.fillRect(x * 10, y * 10, 10, 10);
                }
            }
        }

        // วาด agents
        this.agents.forEach(agent => agent.draw(ctx));
    }
}

// Global variables
let model;
let canvas;
let ctx;
let animationId;

// ฟังก์ชันเริ่ม simulation
function startSimulation() {
    if (!model) {
        canvas = document.getElementById('worldCanvas');
        ctx = canvas.getContext('2d');
        model = new SimulationModel(50, 50, 100); // 50x50 grid, 100 agents
    }
    model.running = true;
    loop();
}

// หยุด simulation
function stopSimulation() {
    if (model) model.running = false;
    cancelAnimationFrame(animationId);
}

// Loop การอัปเดต
function loop() {
    if (model.running) {
        model.step();
        model.draw(ctx);
        document.getElementById('agentCount').textContent = model.agents.length;
        animationId = requestAnimationFrame(loop);
    }
}
