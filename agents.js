export class CreatureAgent {
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
        // หาตำแหน่งที่ดีที่สุดในวิสัยทัศน์ที่มีอาหารมากสุด (toroidal world)
        let bestX = this.x;
        let bestY = this.y;
        let bestFood = 0;
        for (let dx = -this.vision; dx <= this.vision; dx++) {
            for (let dy = -this.vision; dy <= this.vision; dy++) {
                const nx = (this.x + dx + this.model.width) % this.model.width;
                const ny = (this.y + dy + this.model.height) % this.model.height;
                const food = this.model.foodGrid[nx][ny];
                if (food > bestFood || (food === bestFood && Math.random() < 0.5)) { // random tie-breaker
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

    draw(ctx, cellSize) {
        ctx.beginPath();
        ctx.arc(this.x * cellSize + cellSize / 2, this.y * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.group === 'A' ? 'blue' : 'red'; // แยกสีตามกลุ่ม
        ctx.fill();
    }

    // สำหรับ subclass
    createChild() {
        return new CreatureAgent(this.model.nextId++, this.model, this.x, this.y, this.group);
    }
}

export class AgentGroupA extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'A');
        this.vision += 1; // เพิ่ม vision สำหรับ Group A
    }

    createChild() {
        return new AgentGroupA(this.model.nextId++, this.model, this.x, this.y);
    }
}

export class AgentGroupB extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'B');
        this.metabolism = Math.max(1, this.metabolism - 1); // ลด metabolism
    }

    createChild() {
        return new AgentGroupB(this.model.nextId++, this.model, this.x, this.y);
    }
}
