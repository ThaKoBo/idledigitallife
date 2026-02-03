import { BaseAgent } from './BaseAgent.js';

export class GreenAgent extends BaseAgent {
    constructor(x, y) {
        super(x, y, '#2ecc71');
        this.speed = 2.0;
        this.fleeSpeed = 3.5;
        this.detectionRange = 120;
    }

update(agents, foods) {
    this.energy -= 0.1;
    let threat = agents.find(a => a.color === '#ff4d4d' && Math.hypot(this.x - a.x, this.y - a.y) < this.detectionRange);
    
    if (threat) {
        // วิ่งหนี: ทิศทางตรงข้ามกับศัตรู
        let escapeAngle = Math.atan2(this.y - threat.y, this.x - threat.x);
        this.angle = escapeAngle; 
        this.x += Math.cos(this.angle) * this.fleeSpeed;
        this.y += Math.sin(this.angle) * this.fleeSpeed;
    } else {
        // หาอาหารหรือเดินเล่น
        let nearestFood = this.findNearest(foods);
        if (nearestFood) {
            this.steerTowards(nearestFood.x, nearestFood.y, this.speed);
            if (Math.hypot(this.x - nearestFood.x, this.y - nearestFood.y) < 5) {
                this.energy += 30;
                return true; // กินสำเร็จ (ไปลบใน engine)
            }
        } else {
            this.wander(this.speed);
        }
    }
    this.keepInBounds();
}
