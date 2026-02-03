export class BaseAgent {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.energy = 100;
        this.reproThreshold = 200;
        this.angle = Math.random() * Math.PI * 2; // ทิศทางเริ่มต้นเป็นเรเดียน
        this.velocity = { x: 0, y: 0 };
    }

// ฟังก์ชันช่วยเลี้ยวเข้าหาเป้าหมายแบบนุ่มนวล
    steerTowards(targetX, targetY, speed) {
        let desiredAngle = Math.atan2(targetY - this.y, targetX - this.x);
        // ค่อยๆ ปรับมุมเข้าหาเป้าหมาย (Smoothing)
        let diff = desiredAngle - this.angle;
        this.angle += diff * 0.1; 
        
        this.x += Math.cos(this.angle) * speed;
        this.y += Math.sin(this.angle) * speed;
    }

    // เดินตรงไปเรื่อยๆ และสุ่มเลี้ยวนิดหน่อย
    wander(speed) {
        this.angle += (Math.random() - 0.5) * 0.2; // เลี้ยวนิดเดียว
        this.x += Math.cos(this.angle) * speed;
        this.y += Math.sin(this.angle) * speed;
    }

    keepInBounds() {
        if (this.x < 0 || this.x > window.innerWidth) this.angle = Math.PI - this.angle;
        if (this.y < 0 || this.y > window.innerHeight) this.angle = -this.angle;
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
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
