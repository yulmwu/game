class Cloud {
    constructor() {
        this.x = Math.random() * (canvas.width - 150);
        this.y = canvas.height + Math.random() * 100;
        this.rectangles = this.createRectangles();
    }

    createRectangles() {
        const rectangles = [];
        const numRects = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numRects; i++) {
            rectangles.push({
                offsetX: Math.random() * 50 - 25,
                offsetY: Math.random() * 30 - 15,
                width: Math.random() * 60 + 40,
                height: Math.random() * 30 + 20,
            });
        }
        return rectangles;
    }

    update() {
        this.y -= cloudSpeed * stopSpeed;
    }

    draw() {
        ctx.fillStyle = '#FFF';
        this.rectangles.forEach((rect) => {
            ctx.fillRect(this.x + rect.offsetX, this.y + rect.offsetY, rect.width, rect.height);
        });
    }
}

const handleClouds = () => clouds.forEach((cloud, index) => {
    cloud.update();
    cloud.draw();
    cloud.rectangles.forEach((rect) => {
        const rectX = cloud.x + rect.offsetX;
        const rectY = cloud.y + rect.offsetY;
        if (collisionDetection(player, { x: rectX, y: rectY, width: rect.width, height: rect.height })) {
            gameOver = true;
        }
    });
    if (cloud.y < -50) clouds.splice(index, 1);
});
