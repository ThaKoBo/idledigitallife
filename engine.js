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
    // ใช้พื้นหลังแบบจางๆ เพื่อให้เห็นหาง (Tail Effect) จะดูสมูทขึ้น
    ctx.fillStyle = 'rgba(26, 26, 26, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ... ส่วนการอัปเดต Agent ...
    agents.forEach(agent => {
        agent.update(agents, foods);
        // วาด Agent
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        // วาดเป็นทรงหยดน้ำตามทิศทางที่วิ่งจะดูสวยขึ้น
        ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    requestAnimationFrame(loop);
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
