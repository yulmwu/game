class Coin {
    constructor() {
        this.x = Math.random() * (canvas.width - 50);
        this.y = canvas.height + Math.random() * 100;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.image.src = './resources/coin.png';
    }

    update() {
        this.y -= cloudSpeed * stopSpeed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

const handleCoins = () => coins.forEach((coin, index) => {
    coin.update();
    coin.draw();
    if (collisionDetection(player, coin)) {
        scoreIncrement(5)
        particle(coin.x, coin.y)
        coins.splice(index, 1);
    }
    if (coin.y < -50) coins.splice(index, 1);
});
