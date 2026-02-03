export class CreatureAgent {
    constructor(id, model, x, y, group) {
        this.id = id;
        this.model = model;
        this.gridX = x;
        this.gridY = y;
        this.posX = x;
        this.posY = y;
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
        let bestX = this.gridX;
        let bestY = this.gridY;
        let bestFood = 0;
        for (let dx = -this.vision; dx <= this.vision; dx++) {
            for (let dy = -this.vision; dy <= this.vision; dy++) {
                const nx = (this.gridX + dx + this.model.width) % this.model.width;
                const ny = (this.gridY + dy + this.model.height) % this.model.height;
                const food = this.model.foodGrid[nx][ny];
                if (food > bestFood || (food === bestFood && Math.random() < 0.5)) { // random tie-breaker
                    bestFood = food;
                    bestX = nx;
                    bestY = ny;
                }
            }
        }
        this.gridX = bestX;
        this.gridY = bestY;
    }

    update(delta) {
        // คำนวณ dx, dy โดยพิจารณา toroidal (shortest path)
        let dx = this.gridX - this.posX;
        if (Math.abs(dx) > this.model.width / 2) {
            dx -= Math.sign(dx) * this.model.width;
        }
        let dy = this.gridY - this.posY;
        if (Math.abs(dy) > this.model.height / 2) {
            dy -= Math.sign(dy) * this.model.height;
        }

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.01) {
            const speed = 5; // grid units per second
            const moveDist = speed * delta;
            if (moveDist >= dist) {
                this.posX = this.gridX;
                this.posY = this.gridY;
            } else {
                this.posX += (dx / dist) * moveDist;
                this.posY += (dy / dist) * moveDist;
            }

            // Wrap position if needed (for draw)
            if (this.posX < 0) this.posX += this.model.width;
            else if (this.posX >= this.model.width) this.posX -= this.model.width;
            if (this.posY < 0) this.posY += this.model.height;
            else if (this.posY >= this.model.height) this.posY -= this.model.height;
        }
    }

    eat() {
        const food = this.model.foodGrid[this.gridX][this.gridY];
        this.energy += food;
        this.model.foodGrid[this.gridX][this.gridY] = 0;
    }

    reproduce() {
        const child = this.createChild();
        child.energy = Math.floor(this.energy / 2);
        this.energy = Math.floor(this.energy / 2);
        child.gridX = this.gridX;
        child.gridY = this.gridY;
        child.posX = this.gridX;
        child.posY = this.gridY;
        this.model.agents.push(child);
    }

    fight() {
        // หา enemies ในตำแหน่งเดียวกัน (ใช้ grid position)
        const cellmates = this.model.agents.filter(a => a !== this && a.gridX === this.gridX && a.gridY === this.gridY && a.group !== this.group);
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
        ctx.arc(this.posX * cellSize + cellSize / 2, this.posY * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.group === 'A' ? 'blue' : 'red'; // แยกสีตามกลุ่ม
        ctx.fill();
    }

    // สำหรับ subclass
    createChild() {
        return new CreatureAgent(this.model.nextId++, this.model, this.gridX, this.gridY, this.group);
    }
}

export class AgentGroupA extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'A');
        this.vision += 1; // เพิ่ม vision สำหรับ Group A
    }

    createChild() {
        return new AgentGroupA(this.model.nextId++, this.model, this.gridX, this.gridY);
    }
}

export class AgentGroupB extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'B');
        this.metabolism = Math.max(1, this.metabolism - 1); // ลด metabolism
    }

    createChild() {
        return new AgentGroupB(this.model.nextId++, this.model, this.gridX, this.gridY);
    }
}
