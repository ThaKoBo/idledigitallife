import { RedAgent } from './RedAgent.js';
import { GreenAgent } from './GreenAgent.js'; // นำเข้าตัวใหม่

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let agents = [];

// ฟังก์ชันโหลดข้อมูลที่บันทึกไว้
function loadWorld() {
    const saved = localStorage.getItem('mySociety');
    if (saved) {
        const data = JSON.parse(saved);
        return data.map(a => {
            // เช็ค Type จากข้อมูลที่ Save ไว้เพื่อสร้าง Object ให้ถูก Class
            if (a.type === 'RedAgent') return new RedAgent(a.x, a.y);
            if (a.type === 'GreenAgent') return new GreenAgent(a.x, a.y);
        });
    }
    // ถ้าเริ่มใหม่ ให้มีทั้งสองสี
    return [
        new RedAgent(100, 100), 
        new GreenAgent(400, 400),
        new GreenAgent(450, 420)
    ];
}

agents = loadWorld();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    agents.forEach((agent, index) => {
        agent.update(agents);
        
        // วาดตัวละคร
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2);
        ctx.fill();

        if (agent.energy <= 0) agents.splice(index, 1);
    });

    // บันทึกสถานะทุกๆ 2 วินาที (Persistence)
    if (Math.random() < 0.01) {
        const state = agents.map(a => a.saveState());
        localStorage.setItem('mySociety', JSON.stringify(state));
    }

    requestAnimationFrame(loop);
}

loop();
