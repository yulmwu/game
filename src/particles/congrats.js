let congrats = [];

class Congrats {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.5 + 0.5;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.life = 60;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
    }
}

const particle_congrats = (x, y, colors = ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F"]) => {
    for (let i = 0; i < 30; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        congrats.push(new Congrats(x, y, color));
    }
}

const handleCongrats = () => {
    congrats = congrats.filter(particle => particle.life > 0);
    congrats.forEach(congrats => {
        congrats.update();
        congrats.draw();
    });
}
