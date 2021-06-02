class Bird {
    constructor(x, y, w, h, c, finalPosY) {
        this.finalPosY = finalPosY;  
        this.x = x;
        this.y = y - this.finalPosY;
        this.w = w;
        this.h = h;
        this.c = c;
        this.dx = -gameSpeed;

        this.type = RandomIntInRange(0, 2);

        switch(this.type) {
            case 0: //flying low
              this.y -= player.originalHeight - 45;
              break;
            case 1: //flying middle
              this.y -= player.originalHeight - 23;
              break;
            case 2: //flying high
              this.y -= player.originalHeight + 5;
              break;
        }
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