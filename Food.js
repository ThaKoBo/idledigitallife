export class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.energyValue = 25; // พลังงานที่ Green จะได้รับ
        this.size = 3;
        this.color = '#f1c40f'; // สีเหลืองทอง
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}
