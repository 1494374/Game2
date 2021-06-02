class Player {
    constructor(x, y, w, h, c, finalPosY, playerNumber) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dy = 0;
        this.jumpForce = 7;
        this.originalHeight = h;
        this.originalWidth = w;
        this.grounded = false;
        this.jumpTimer = 0;
        this.finalPosY= finalPosY;
        this.playerNumber = playerNumber;
    }

    Animate() {
        // Jump
        if (this.playerNumber == 1) {
            if (keys['ArrowUp']) {
                this.Jump();
            } else {
                this.jumpTimer = 0;
            }

            if (keys['ArrowDown']) {
                this.h = this.originalHeight / 2;
                this.w = this.originalWidth * 2;
            } else {
                this.h = this.originalHeight;
                this.w = this.originalWidth;
            }
        } else { // player 2
            if (keys['KeyW']) {
                this.Jump();
            } else {
                this.jumpTimer = 0;
            }

            if (keys['KeyS']) {
                this.h = this.originalHeight / 2;
                this.w = this.originalWidth * 2;
            } else {
                this.h = this.originalHeight;
                this.w = this.originalWidth;
            }
        }

        this.y += this.dy;

        // Gravity
        if (this.y + this.h < canvas.height - this.finalPosY) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.finalPosY - this.h;
        }
        
        this.Draw();
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) {
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer / 50);
        }
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}