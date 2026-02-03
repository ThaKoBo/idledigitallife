import { SimulationModel } from './world.js';

// Global variables
let model;
let canvas;
let ctx;
let animationId;
let cellSize;
let lastTime = 0;
let accumulator = 0;
const logicFPS = 10; // ปรับเป็น 10 เพื่อเห็น motion เร็วขึ้น
const logicStep = 1 / logicFPS;

// ฟังก์ชัน resize canvas ตาม browser width
function resizeCanvas() {
    const width = window.innerWidth * 0.9; // 90% ของ browser width เพื่อ margin
    cellSize = Math.floor(width / model.width);
    canvas.width = model.width * cellSize;
    canvas.height = model.height * cellSize;
    console.log("Canvas resized to", canvas.width, "x", canvas.height); // Debug
}

// ฟังก์ชันเริ่ม simulation
window.startSimulation = function() {
    console.log("Start button clicked"); // Debug
    if (!model) {
        canvas = document.getElementById('worldCanvas');
        ctx = canvas.getContext('2d');
        model = new SimulationModel(50, 50); // 50x50 grid
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        console.log("Model initialized with", model.agents.length, "agents"); // Debug
    }
    model.running = true;
    lastTime = 0;
    accumulator = 0;
    requestAnimationFrame(loop);
    console.log("Simulation running"); // Debug
};

// หยุด simulation
window.stopSimulation = function() {
    console.log("Stop button clicked"); // Debug
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
