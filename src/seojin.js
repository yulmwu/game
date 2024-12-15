class Seojin {
    constructor() {
        this.x = Math.random() * (canvas.width - 50);
        this.y = canvas.height + Math.random() * 100;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.image.src = './resources/seojin.png';
    }

    update() {
        this.y -= (cloudSpeed / 2) * stopSpeed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.font = '15px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("무함마드 바크 알 서진", this.x + this.width / 2 - ctx.measureText("무함마드 바크 알 서진").width / 2, this.y + this.height + 30);
        ctx.fillText(" محمد بكر السرزين", this.x + this.width / 2 - ctx.measureText(" محمد بكر السرزين").width / 2, this.y + this.height + 60);
    }
}

const handleSeojins = () => seojins.forEach((seojin, index) => {
    seojin.update();
    seojin.draw();

    if (collisionDetection(player, seojin)) {
        scoreIncrement(10)
        seojins.splice(index, 1);
    }
    if (seojin.y < -50) seojins.splice(index, 1);
});
