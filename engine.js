import { RedAgent } from './RedAgent.js';
import { GreenAgent } from './GreenAgent.js';
import { Food } from './Food.js';

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let agents = [];
let foods = [];

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. สุ่มเกิดอาหาร (พืช)
    if (Math.random() < 0.1) { // โอกาสเกิดอาหารในแต่ละเฟรม
        foods.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    // 2. วาดอาหาร
    foods.forEach(f => f.draw(ctx));

    // 3. จัดการ Agent
    let newBabies = []; // เก็บตัวที่เกิดใหม่ในเฟรมนี้
    
    agents = agents.filter(a => a.energy > 0); // ลบตัวที่ตาย

    agents.forEach(agent => {
        // อัปเดตพฤติกรรม (ส่งทั้ง agents และ foods ให้ไปคำนวณ)
        agent.update(agents, foods);
        
        // วาดตัวละคร
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // ตรวจสอบการขยายพันธุ์
        if (agent.canReproduce()) {
            newBabies.push(agent.reproduce());
        }
    });

    // เพิ่มเด็กเกิดใหม่เข้าไปในระบบ
    agents.push(...newBabies);

    // ป้องกันประชากรล้น (Limit) เพื่อไม่ให้คอมค้าง
    if (agents.length > 200) agents.shift();

    requestAnimationFrame(loop);
}

// เริ่มต้นระบบ
agents = [new GreenAgent(100, 100), new RedAgent(300, 300)];
loop();
