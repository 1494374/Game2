class Obstacle {
    constructor(x, y, t, c, finalPosY) {
        switch(t) {
            case 0: //small obstacle
            this.w = 20;
            this.h = 40;
            break;
            case 1: //big obstacle
            this.w = 30;
            this.h = 60;
            break;
            case 2: //medium obstacle
            this.w = 60;
            this.h = 40;
            break;
        }

        this.finalPosY = finalPosY;
        this.x = x + this.w;
        this.y = y - this.h - this.finalPosY;
        this.c = c;
        this.dx = -gameSpeed;
    }

    Update() {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}