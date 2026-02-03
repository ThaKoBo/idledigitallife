import { BaseAgent } from './BaseAgent.js';

export class RedAgent extends BaseAgent {
    constructor(x, y) {
        super(x, y, '#ff4d4d');
        this.speed = 2.8; // เร็วกว่าเขียวนิดหน่อย
        this.huntRange = 200;
    }

    update(agents) {
        this.energy -= 0.15; // เผาผลาญพลังงานสูงกว่า

        // มองหาเหยื่อ (GreenAgent)
        let prey = null;
        let minDist = Infinity;

        agents.forEach((a) => {
            if (a.color === '#2ecc71') { // ล่าสีเขียว
                let d = Math.hypot(this.x - a.x, this.y - a.y);
                if (d < minDist) {
                    minDist = d;
                    prey = a;
                }
            }
        });

        if (prey && minDist < this.huntRange) {
            // ติดตามเหยื่อ
            let angle = Math.atan2(prey.y - this.y, prey.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;

            // กินเหยื่อเมื่อถึงตัว
            if (minDist < 8) {
                this.energy += (prey.energy * 0.5) + 20; // ได้พลังงานจากตัวเขียว
                prey.energy = -1; // ฆ่าสีเขียว
            }
        } else {
            this.x += (Math.random() - 0.5) * this.speed;
            this.y += (Math.random() - 0.5) * this.speed;
        }
    }
}
