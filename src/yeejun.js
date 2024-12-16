class Yeejun {
    constructor() {
        this.x = Math.random() * (canvas.width - 50);
        this.y = canvas.height + Math.random() * 100;
        this.width = 40;
        this.height = 80;
        this.image = new Image();
        this.image.src = './resources/yeejun.png';
    }

    update() {
        this.y -= (cloudSpeed / 2) * stopSpeed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.font = '15px GmarketSansMedium';
        ctx.fillStyle = 'black';
        ctx.fillText("잼버리 보이스카우트 예준", this.x + this.width / 2 - ctx.measureText("잼버리 보이스카우트 예준").width / 2, this.y + this.height + 30);
    }
}

const handleYeejuns = () => yeejuns.forEach((yeejun, index) => {
    yeejun.update();
    yeejun.draw();

    if (collisionDetection(player, yeejun)) {
        scoreIncrement(10)
        particle(yeejun.x, yeejun.y)
        yeejuns.splice(index, 1);
    }
    if (yeejun.y < -50) yeejuns.splice(index, 1);
});
