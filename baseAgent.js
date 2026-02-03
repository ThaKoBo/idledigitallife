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
        this.group = group;
        this.foodEaten = 0;
    }

    step() {
        this.move();
        if (this.foodEaten < 2) {
            this.eat();
        }
        this.energy -= this.metabolism;
        if (this.energy < 0) {
            this.die();
        }
        this.checkReproduce();
    }

    move() {
        // หาตำแหน่งที่ดีที่สุด
        let bestX = this.gridX;
        let bestY = this.gridY;
        let bestCount = 0;
        for (let dx = -this.vision; dx <= this.vision; dx++) {
            for (let dy = -this.vision; dy <= this.vision; dy++) {
                const nx = (this.gridX + dx + this.model.width) % this.model.width;
                const ny = (this.gridY + dy + this.model.height) % this.model.height;
                let count;
                if (this.foodEaten < 2) {
                    // หาอาหาร
                    count = this.getTargetCount(nx, ny);
                } else {
                    // หาคู่
                    count = this.model.getAgentsAt(nx, ny, this.group).length;
                }
                if (count > bestCount || (count === bestCount && Math.random() < 0.5)) {
                    bestCount = count;
                    bestX = nx;
                    bestY = ny;
                }
            }
        }
        this.gridX = bestX;
        this.gridY = bestY;
    }

    getTargetCount(x, y) {
        // Override in subclass
        return 0;
    }

    eat() {
        // Override in subclass
    }

    checkReproduce() {
        const mates = this.model.getAgentsAt(this.gridX, this.gridY, this.group).filter(a => a !== this && a.foodEaten === 2);
        if (mates.length >= 1) {
            const mate = mates[0];
            if (this.id < mate.id) { // ประมวลผลครั้งเดียวต่อคู่
                for (let i = 0; i < this.numChildren; i++) {
                    const child = this.createChild();
                    child.energy = Math.floor((this.energy + mate.energy) / 4); // แบ่ง energy
                    child.gridX = this.gridX;
                    child.gridY = this.gridY;
                    child.posX = this.gridX;
                    child.posY = this.gridY;
                    this.model.agents.push(child);
                }
                this.foodEaten = 0;
                mate.foodEaten = 0;
                this.energy = Math.floor(this.energy / 2);
                mate.energy = Math.floor(mate.energy / 2);
            }
        }
    }

    update(delta) {
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
            const speed = 5;
            const moveDist = speed * delta;
            if (moveDist >= dist) {
                this.posX = this.gridX;
                this.posY = this.gridY;
            } else {
                this.posX += (dx / dist) * moveDist;
                this.posY += (dy / dist) * moveDist;
            }

            if (this.posX < 0) this.posX += this.model.width;
            else if (this.posX >= this.model.width) this.posX -= this.model.width;
            if (this.posY < 0) this.posY += this.model.height;
            else if (this.posY >= this.model.height) this.posY -= this.model.height;
        }
    }

    die() {
        this.model.agents = this.model.agents.filter(a => a !== this);
    }

    draw(ctx, cellSize) {
        ctx.beginPath();
        ctx.arc(this.posX * cellSize + cellSize / 2, this.posY * cellSize + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.foodEaten > 0) {
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.font = `${Math.min(12, cellSize / 2)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.foodEaten, this.posX * cellSize + cellSize / 2, this.posY * cellSize + cellSize / 2);
            ctx.restore();
        }
    }

    createChild() {
        // Override in subclass
        return null;
    }
}
