export class BaseAgent {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.energy = 100;
        this.reproThreshold = 200; // ต้องมีพลังงานถึงระดับนี้ถึงจะแบ่งตัวได้
        this.alive = true;
    }

    // เช็คว่าพร้อมแบ่งตัวหรือยัง
    canReproduce() {
        return this.energy >= this.reproThreshold;
    }

    // สร้างตัวใหม่จากตัวเดิม
    reproduce() {
        this.energy /= 2; // แบ่งพลังงานไปให้ลูกครึ่งหนึ่ง
        // สร้างลูกในตำแหน่งใกล้ๆ ตัวแม่
        const offSpring = new this.constructor(this.x + (Math.random() - 0.5) * 20, this.y + (Math.random() - 0.5) * 20);
        return offSpring;
    }

    // ระบบ Save สถานะลง LocalStorage
    saveState() {
        return { x: this.x, y: this.y, energy: this.energy, type: this.constructor.name };
    }

    eat(foodValue) {
        this.energy += foodValue;
    }
}
