import { CreatureAgent } from './baseAgent.js';

export class AgentPrey extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'Prey');
        this.color = 'blue';
        this.numChildren = 2;
        this.metabolism = Math.max(1, this.metabolism - 1);
    }

    getTargetCount(x, y) {
        return this.model.getFoodAt(x, y).length;
    }

    eat() {
        const foods = this.model.getFoodAt(this.gridX, this.gridY);
        if (foods.length > 0) {
            const food = foods[Math.floor(Math.random() * foods.length)];
            this.foodEaten = Math.min(2, this.foodEaten + 1);
            this.energy += 10;
            this.model.foodAgents = this.model.foodAgents.filter(f => f !== food);
        }
    }

    createChild() {
        return new AgentPrey(this.model.nextId++, this.model, this.gridX, this.gridY);
    }
}
