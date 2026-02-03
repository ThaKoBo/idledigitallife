import { BaseAgent } from './BaseAgent.js';

export class GreenAgent extends BaseAgent {
    constructor(x, y) {
        super(x, y, '#2ecc71');
        this.speed = 2.0;
        this.fleeSpeed = 3.5;
        this.detectionRange = 120;
    }

    update(agents, foods) {
        this.energy -= 0.1; // เสียพลังงานพื้นฐาน

        // 1. ตรวจสอบศัตรู (Red) ถ้าเจอต้องหนีก่อนสิ่งอื่นใด
        let threat = agents.find(a => a.color === '#ff4d4d' && Math.hypot(this.x - a.x, this.y - a.y) < this.detectionRange);
        
        if (threat) {
            let angle = Math.atan2(this.y - threat.y, this.x - threat.x);
            this.x += Math.cos(angle) * this.fleeSpeed;
            this.y += Math.sin(angle) * this.fleeSpeed;
        } else {
            // 2. ถ้าไม่มีศัตรู ให้มองหาอาหาร (Food)
            let nearestFood = null;
            let minDist = Infinity;

            foods.forEach((f, index) => {
                let d = Math.hypot(this.x - f.x, this.y - f.y);
                if (d < minDist) {
                    minDist = d;
                    nearestFood = { item: f, index: index };
                }
            });

            if (nearestFood && minDist < 150) {
                // เดินไปหาอาหาร
                let angle = Math.atan2(nearestFood.item.y - this.y, nearestFood.item.x - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;

                // กินอาหาร
                if (minDist < 5) {
                    this.energy += nearestFood.item.energyValue;
                    foods.splice(nearestFood.index, 1);
                }
            } else {
                // เดินสุ่มเมื่อไม่มีอะไรทำ
                this.x += (Math.random() - 0.5) * this.speed;
                this.y += (Math.random() - 0.5) * this.speed;
            }
        }
        this.keepInBounds();
    }

    keepInBounds() {
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
    }
}
