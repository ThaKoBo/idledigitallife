export class BaseAgent {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.energy = 100;
        this.id = Math.random();
        this.alive = true;
    }

    // ระบบ Save สถานะลง LocalStorage
    saveState() {
        return { x: this.x, y: this.y, energy: this.energy, type: this.constructor.name };
    }

    eat(foodValue) {
        this.energy += foodValue;
    }
}
