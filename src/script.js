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
    stopSpeed = 1,
    gravityScore = 1,
    fall_m = 0,
    inv = false;
let messageTimer = 0;

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

    if (player.y > canvas.height + 50) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('성공 😭', canvas.width / 2 - 130, canvas.height / 2 + 120);

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

    fall_m += gravityScore * stopSpeed
    gravity.innerText = `떨어진 높이: ${fall_m.toFixed(1)}m, 중력: x${gravityScore.toFixed(1)}`

    if (score > 200) {
        stopSpeed = 0
        winds = []
    }

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
    if (!stopSpeed) return

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
