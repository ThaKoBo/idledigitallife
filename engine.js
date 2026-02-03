import { SimulationModel } from './world.js';
import { AgentGroupA, AgentGroupB } from './agents.js';

// Global variables
let model;
let canvas;
let ctx;
let animationId;
let cellSize;
let lastTime = 0;
let accumulator = 0;
const logicFPS = 5; // 5 steps ต่อวินาที เพื่อเห็น motion ชัดเจน
const logicStep = 1 / logicFPS;

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
        model = new SimulationModel(50, 50, 4); // 50x50 grid, total 4 agents (2A + 2B)
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    model.running = true;
    lastTime = 0;
    accumulator = 0;
    requestAnimationFrame(loop);
};

// หยุด simulation
window.stopSimulation = function() {
    if (model) model.running = false;
    cancelAnimationFrame(animationId);
};

// Loop การอัปเดต
function loop(timestamp) {
    if (model.running) {
        if (!lastTime) lastTime = timestamp;
        let delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        model.spawnFood(delta);

        accumulator += delta;
        while (accumulator >= logicStep) {
            model.step();
            accumulator -= logicStep;
        }

        model.updateAgents(delta);
        model.draw(ctx, cellSize);
        document.getElementById('agentCount').textContent = model.agents.length;

        animationId = requestAnimationFrame(loop);
    }
}
