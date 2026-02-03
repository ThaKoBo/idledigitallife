import { RedAgent } from './RedAgent.js';

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
        return data.map(a => new RedAgent(a.x, a.y)); // ในอนาคตต้องเช็ก Type เพื่อสร้าง Object ให้ถูกตัว
    }
    return [new RedAgent(100, 100), new RedAgent(200, 200)]; // ถ้าไม่มีข้อมูลให้เริ่มใหม่ 2 ตัว
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
