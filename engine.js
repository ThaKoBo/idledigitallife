import { SimulationModel } from './world.js';
import { AgentGroupA, AgentGroupB } from './agents.js';

// Global variables
let model;
let canvas;
let ctx;
let animationId;
let cellSize;

// ฟังก์ชัน resize canvas ตาม browser width
function resizeCanvas() {
    const width = window.innerWidth * 0.9; // 90% ของ browser width เพื่อ margin
    cellSize = Math.floor(width / model.width);
    canvas.width = model.width * cellSize;
    canvas.height = model.height * cellSize;
}

// ฟังก์ชันเริ่ม simulation
window.startSimulation = function() {
    if (!model) {
        canvas = document.getElementById('worldCanvas');
        ctx = canvas.getContext('2d');
        model = new SimulationModel(50, 50, 100); // 50x50 grid, 100 agents
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    model.running = true;
    loop();
};

// หยุด simulation
window.stopSimulation = function() {
    if (model) model.running = false;
    cancelAnimationFrame(animationId);
};

// Loop การอัปเดต
function loop() {
    if (model.running) {
        model.step();
        model.draw(ctx, cellSize);
        document.getElementById('agentCount').textContent = model.agents.length;
        animationId = requestAnimationFrame(loop);
    }
}
