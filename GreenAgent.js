import { BaseAgent } from './BaseAgent.js';

export class GreenAgent extends BaseAgent {
    constructor(x, y) {
        super(x, y, '#2ecc71'); // สีเขียวสดใส
        this.speed = 2.0;       // ความเร็วปกติช้ากว่าสีแดงเล็กน้อย
        this.fleeSpeed = 4.0;   // ความเร็วตอนหนี (ใส่เกียร์หมา)
        this.detectionRange = 100; // ระยะการมองเห็นศัตรู
    }

    update(agents, foods) {
        this.energy -= 0.08; // เผาผลาญพลังงานน้อยกว่าสีแดง (ประหยัดพลังงาน)
        
        // 1. ตรวจสอบศัตรู (สีแดง) รอบข้าง
        let threat = null;
        for (let other of agents) {
            if (other.color === '#ff4d4d') { // ถ้าเจอสีแดง
                let dist = Math.hypot(this.x - other.x, this.y - other.y);
                if (dist < this.detectionRange) {
                    threat = other;
                    break;
                }
            }
        }

        // 2. Logic การเคลื่อนที่
        if (threat) {
            // --- วิ่งหนีศัตรู ---
            let angle = Math.atan2(this.y - threat.y, this.x - threat.x);
            this.x += Math.cos(angle) * this.fleeSpeed;
            this.y += Math.sin(angle) * this.fleeSpeed;
            this.energy -= 0.2; // การวิ่งหนีใช้พลังงานสูงมาก
        } else {
            // --- เดินหาอาหารแบบสุ่ม ---
            this.x += (Math.random() - 0.5) * this.speed;
            this.y += (Math.random() - 0.5) * this.speed;
        }

        // 3. ป้องกันการหลุดขอบจอ (Simple Boundary Check)
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
    }
}
