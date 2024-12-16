let lees = [];

class Lee {
    constructor() {
        this.x = Math.random() * (canvas.width - 50);
        this.y = canvas.height + Math.random() * 100;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.image.src = './resources/lee.png';
        this.life = true
    }

    update() {
        this.y -= (cloudSpeed / 3) * stopSpeed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.font = '15px GmarketSansMedium';
        ctx.fillStyle = 'blue';
        ctx.fillText("윤석열 탄핵소추안 가결!!", this.x + this.width / 2 - ctx.measureText("윤석열 탄핵소추안 가결").width / 2, this.y + this.height + 30);
        ctx.fillText("기분좋은 이재명", this.x + this.width / 2 - ctx.measureText("기분좋은 이재명").width / 2, this.y + this.height + 60);
    }
}

const handleLees = () => lees.forEach((lee, index) => {
    lee.update();
    lee.draw();

    if (lee.life && collisionDetection(player, lee)) {
        lee.life = false
        scoreIncrement(-50)
        particle_explode(lee.x, lee.y, ['#000000'])
        lee.image.src = './resources/drumt.png';
    }
    if (lee.y < -100) lees.splice(index, 1);
});
