import { BaseAgent } from './BaseAgent.js';

export class RedAgent extends BaseAgent {
    constructor(x, y) {
        super(x, y, '#ff4d4d');
        this.speed = 2.5;
    }

    update(agents) {
        this.energy -= 0.15; // เผาผลาญเร็วเพราะดุร้าย
        this.x += (Math.random() - 0.5) * this.speed;
        this.y += (Math.random() - 0.5) * this.speed;

        // Logic การล่า: เจอสีอื่นแล้วลดพลังงานฝ่ายตรงข้าม
        agents.forEach(other => {
            if (other !== this && other.color !== this.color) {
                let dist = Math.hypot(this.x - other.x, this.y - other.y);
                if (dist < 10) other.energy -= 1; 
            }
        });
    }
}
