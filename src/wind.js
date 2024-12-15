class Wind {
    constructor() {
        const xDirection = Math.random() > 0.5 ? 1 : -1
        const offsetX = Math.random() * canvas.width * 0.3
        const x = Math.random() * canvas.width
        this.x = xDirection + offsetX + x
        this.y = canvas.height
        this.width = 1 + Math.random() * 3
        this.height = Math.random() * 30 + 50
    }

    update() {
        this.y -= stopSpeed * (cloudSpeed + Math.random() * 1)
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const handleWinds = () => winds.forEach((wind, index) => {
    wind.update()
    wind.draw()

    if (wind.y < -50) winds.splice(index, 1)
})
