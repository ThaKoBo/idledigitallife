import { CreatureAgent } from './baseAgent.js';

export class AgentHunt extends CreatureAgent {
    constructor(id, model, x, y) {
        super(id, model, x, y, 'Hunt');
        this.color = 'red';
        this.numChildren = 1;
        this.vision += 1;
    }

    getTargetCount(x, y) {
        return this.model.getAgentsAt(x, y, 'Prey').length;
    }

    eat() {
        const preys = this.model.getAgentsAt(this.gridX, this.gridY, 'Prey');
        if (preys.length > 0) {
            const prey = preys[Math.floor(Math.random() * preys.length)];
            this.foodEaten = Math.min(2, this.foodEaten + 1);
            this.energy += Math.floor(prey.energy / 2);
            prey.die();
        }
    }

    createChild() {
        return new AgentHunt(this.model.nextId++, this.model, this.gridX, this.gridY);
    }
}
