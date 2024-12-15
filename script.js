const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreBoard = document.getElementById('scoreBoard');
const gravity = document.getElementById('gravity');
const fcooltime = document.getElementById('fcooltime');
const messageBox = document.getElementById('message');
const startScreen = document.getElementById('startScreen');

const cloudFrequency = 0.04,
    coinFrequency = 0.007,
    seojinFrequency = 0.002

let score = 0,
    scoreMax = false,
    gameOver = false,
    cloudSpeed = 7,
    gravityScore = 1,
    fall_m = 0,
    inv = false;
let messageTimer = 0;

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
    }

    move() {
        this.x += this.dx;
        this.y = this.baseY + Math.sin(this.angle) * this.amplitude;
        this.angle += 0.05;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.msg[0], this.x + this.width / 2 - ctx.measureText(this.msg[0]).width / 2, this.y + this.height + 30);
        ctx.fillText(this.msg[1], this.x + this.width / 2 - ctx.measureText(this.msg[1]).width / 2, this.y + this.height + 60);
    }

    playerDisplayMessage(text, t = 420) {
        this.msg = text
        this.player_messageTimer = t
    }
}

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
        this.y -= cloudSpeed;
    }

    draw() {
        ctx.fillStyle = '#FFF';
        this.rectangles.forEach((rect) => {
            ctx.fillRect(this.x + rect.offsetX, this.y + rect.offsetY, rect.width, rect.height);
        });
    }
}

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
        this.y -= cloudSpeed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

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
        this.y -= cloudSpeed / 2;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.font = '15px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("무함마드 바크 알 서진", this.x + this.width / 2 - ctx.measureText("무함마드 바크 알 서진").width / 2, this.y + this.height + 30);
        ctx.fillText(" محمد بكر السرزين", this.x + this.width / 2 - ctx.measureText(" محمد بكر السرزين").width / 2, this.y + this.height + 60);
    }
}

class Wind {
    constructor() {
        const xDirection = Math.random() > 0.5 ? 1 : -1
        const offsetX = Math.random() * canvas.width * 0.3
        const x = Math.random() * canvas.width
        this.x = xDirection + offsetX + x
        this.y = canvas.height
        this.width = 1 + Math.random() * 3
        this.height = Math.random() * 30 + 50
        this.speed = cloudSpeed + Math.random() * 1
    }

    update() {
        this.y -= this.speed
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const player = new Player();

let clouds = [];
let coins = [];
let seojins = [];
let winds = [];

const gameOverImage = new Image();
gameOverImage.src = './resources/drum.png';

const player_messages = [
    ['你在说什么？你上次说中华人民共和国应该解散了', '무슨 소리야? 너가 저번에 중화인민공화국이 해체되어야 한다고 말했잖아'],
    ['上次说要为香港示威加油的是什么?', '그럼 홍콩 시위를 응원한다고 말했던건 뭐야?'],
    ['那么习近平什么时候才会恶毒呢？', '그래서 시진핑은 언제 암살할거야?'],
    ['你如何支持中国的民主化令人惊讶。', '중국의 민주화를 응원하다니 정말 대단해'],
    ['我爱北京天安门', '나는 베이징 천안문을 사랑해'],
];

const displayMessage = (text, t = 180) => {
    messageBox.innerText = text
    messageTimer = t
}

const scoreIncrement = (inc) => {
    score += inc;
    scoreBoard.innerText = `Social Credit (점수): ${score}`;

    if (score <= 50 && score % 5 === 0) {
        displayMessage('중력의 양이 증가합니다!')
        gravityScore *= 1.2
    }

    if (score > 50 && !scoreMax) {
        scoreMax = true
        displayMessage('중력의 양이 최대치에 도달했습니다!!')
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

const handleCoins = () => coins.forEach((coin, index) => {
    coin.update();
    coin.draw();
    if (collisionDetection(player, coin)) {
        scoreIncrement(5)
        coins.splice(index, 1);
    }
    if (coin.y < -50) coins.splice(index, 1);
});

const handleSeojins = () => seojins.forEach((seojin, index) => {
    seojin.update();
    seojin.draw();

    if (collisionDetection(player, seojin)) {
        scoreIncrement(10)
        seojins.splice(index, 1);
    }
    if (seojin.y < -50) seojins.splice(index, 1);
});

const handleWinds = () => winds.forEach((wind, index) => {
    wind.update()
    wind.draw()

    if (wind.y < -50) winds.splice(index, 1)
})

const collisionDetection = (player, object) => (
    player.x < object.x + object.width &&
    player.x + player.width > object.x &&
    player.y < object.y + object.height &&
    player.y + player.height > object.y
);

const gameLoop = () => {
    if (gameOver && !inv) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Gay Over 😭', canvas.width / 2 - 130, canvas.height / 2 + 120);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.move();
    player.draw();

    if (Math.random() < 0.05) {
        winds.push(new Wind())
        winds.push(new Wind())
    }

    handleWinds()

    const _score_max = score <= 150 ? score : 150

    if (Math.random() < cloudFrequency + _score_max * 0.0004) clouds.push(new Cloud())
    if (Math.random() < coinFrequency + _score_max * 0.0002) coins.push(new Coin())
    if (Math.random() < seojinFrequency + _score_max * 0.00002) seojins.push(new Seojin())

    handleClouds()
    handleCoins()
    handleSeojins()

    if (score <= 50 && score % 5 === 0) cloudSpeed += 0.00025

    if (messageTimer > 0) {
        messageTimer--
        if (messageTimer === 0) messageBox.innerText = ''
    }

    if (player.player_f_cooltime > 0) {
        player.player_f_cooltime--
        if (player.player_f_cooltime === 0) {
            fcooltime.innerText = `F 쿨타임: 사용 가능`
        } else {
            fcooltime.innerText = `F 쿨타임: ${(player.player_f_cooltime / 60).toFixed(1)}s`
        }
    }

    if (player.player_messageTimer > 0) {
        player.player_messageTimer--
        if (player.player_messageTimer === 0) {
            player.is_player_saying = false
            player.msg = ['', '']
        }
    }

    fall_m += gravityScore
    gravity.innerText = `떨어진 높이: ${fall_m.toFixed(1)}m, 중력: x${gravityScore.toFixed(1)}`

    requestAnimationFrame(gameLoop);
}

const startGame = () => {
    startScreen.style.display = 'none';
    gameLoop();
}

const startInvGame = () => {
    startScreen.style.display = 'none';
    inv = true
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.dx = -10;
            break;
        case 'd':
            player.dx = 10;
            break;
        case 'q':
            player.dx = -15;
            break;
        case 'e':
            player.dx = 15;
            break;
        case 'f':
            if (!player.is_player_saying && player.player_f_cooltime == 0) {
                if (score >= 30) {
                    player.is_player_saying = true
                    player.player_f_cooltime = 600

                    player.playerDisplayMessage(player_messages[Math.floor(Math.random() * player_messages.length)])
                    clouds = []
                }
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (['a', 'd', 'q', 'e'].includes(e.key)) player.dx = 0;
});
