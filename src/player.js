class Player {
    constructor() {
        this.x = canvas.width / 2 - 25;
        this.y = canvas.height / 2 - 50;
        this.baseY = canvas.height / 2 - 200;
        this.width = 100;
        this.height = 100;
        this.dx = 0;
        this.dy = 0;
        this.amplitude = 20;
        this.angle = 0;
        this.image = new Image();
        this.image.src = './resources/player.png';
        this.msg = ['', ''];
        this.is_player_saying = false;
        this.player_messageTimer = 0
        this.player_f_cooltime = 0
        this.fast_down = false
    }

    move() {
        this.x += this.dx;

        if (stopSpeed == 0) {
            this.y += cloudSpeed
            inv = true
        } else {
            this.y = this.baseY + Math.sin(this.angle) * this.amplitude;
            this.angle += 0.05;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    draw() {
        if (this.fast_down) {
            ctx.drawImage(this.image, this.x + 25, this.y, this.width / 2, this.height);
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        ctx.font = '20px GmarketSansMedium';
        ctx.fillStyle = 'white';
        ctx.fillText(this.msg[0], this.x + this.width / 2 - ctx.measureText(this.msg[0]).width / 2, this.y + this.height + 30);
        ctx.fillText(this.msg[1], this.x + this.width / 2 - ctx.measureText(this.msg[1]).width / 2, this.y + this.height + 60);

        if (is_hanamja) {
            const msg = "하남자모드 사용중 🥵"
            ctx.fillText(msg, this.x + this.width / 2 - ctx.measureText(msg).width / 2, this.y + this.height - 30);
        }
    }

    playerDisplayMessage(text, t = 420) {
        this.msg = text
        this.player_messageTimer = t
    }
}
