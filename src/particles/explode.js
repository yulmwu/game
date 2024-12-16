let explodes = []

class Explode {
    constructor(x, y, color, isSmoke = false) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 2 + 0.5
        this.color = color
        this.speedX = (Math.random() - 0.5) * 20
        this.speedY = (Math.random() - 0.5) * 20
        this.life = 20
        this.opacity = 1
        this.isSmoke = isSmoke
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.isSmoke) {
            this.opacity -= 0.01
            this.radius += 0.2
        } else {
            this.opacity -= 0.02
        }
        this.life--
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
}

const particle_explode = (x, y) => {
    const colors = ["#FF4500", "#FF6347", "#FFA500", "#FFD700"];
    for (let i = 0; i < 100; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        explodes.push(new Explode(x, y, color))
    }

    for (let i = 0; i < 50; i++) {
        explodes.push(new Explode(x, y, 'rgba(100, 100, 100, 0.5)', true))
    }
}

const handleExplodes = () => {
    explodes = explodes.filter(particle => particle.life > 0 && particle.opacity > 0);
    explodes.forEach(particle => {
        particle.update();
        particle.draw();
    });
}
