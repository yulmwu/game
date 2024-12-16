const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreBoard = document.getElementById('scoreBoard');
const gravity = document.getElementById('gravity');
const fcooltime = document.getElementById('fcooltime');
const messageBox = document.getElementById('message');
const messageBox2 = document.getElementById('message2');
const startScreen = document.getElementById('startScreen');

const cloudFrequency = 0.04,
    coinFrequency = 0.007,
    seojinFrequency = 0.002,
    yeejunFrequency = 0.002,
    leeFrequency = 0.001

let score = 0,
    scoreMax = false,
    gameOver = false,
    cloudSpeed = 7,
    stopSpeed = 1,
    gravityScore = 1,
    fall_m = 0,
    inv = false,
    free = false,
    use_background = true,
    is_hanamja = false;
let messageTimer, messageTimer2 = 0;

const player = new Player();

let clouds = [];

let coins = [];
let seojins = [];
let yeejuns = [];
let lees = [];

let winds = [];
let particles = [];

const gameOverImage = new Image();
gameOverImage.src = './resources/drum.png';

const nisImage = new Image();
nisImage.src = './resources/nis.webp';

const backgroundImage = new Image();
backgroundImage.src = './resources/background.png'

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

const displayMessage2 = (text, t = 180) => {
    messageBox2.innerText = text
    messageTimer2 = t
}

const scoreIncrement = (inc) => {
    score += inc;
    scoreBoard.innerText = `Social Credit (점수): ${score}`;

    if (score <= 50 && score % 5 === 0) gravityScore *= 1.2

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
        messageBox.innerText = ''
        messageBox2.innerText = ''

        ctx.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200);
        ctx.font = '50px GmarketSansMedium';
        ctx.fillStyle = 'white';

        const msg = 'Gay Over 😭'
        ctx.fillText(msg, canvas.width / 2 - ctx.measureText(msg).width / 2, canvas.height / 2 + 120);

        return;
    }

    if (player.y > canvas.height + 50) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        messageBox.innerText = ''
        messageBox2.innerText = ''

        ctx.drawImage(nisImage, canvas.width / 2 - 350, canvas.height / 2 - 166 - 50, 700, 332);
        ctx.font = '25px GmarketSansMedium';
        ctx.fillStyle = 'white';

        const msg = '어이쿠, 경로를 잘못잡아 국정원에 떨어졌네요~'
        ctx.fillText(msg, canvas.width / 2 - ctx.measureText(msg).width / 2, canvas.height / 2 + 150);

        const msg2 = '조사를 받던 중 고문으로 인해 사망했습니다.'
        ctx.fillText(msg2, canvas.width / 2 - ctx.measureText(msg2).width / 2, canvas.height / 2 + 190);

        const msg3 = '간첩 신고는 전국 어디서나 국번없이 1137'
        ctx.fillText(msg3, canvas.width / 2 - ctx.measureText(msg3).width / 2, canvas.height / 2 + 250);

        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (use_background) ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    player.move();
    player.draw();

    if (Math.random() < 0.05) {
        winds.push(new Wind())
        winds.push(new Wind())
    }

    handleWinds()

    const _score_max = score <= 150 ? score : 150

    if (Math.random() < cloudFrequency + _score_max * 0.0004) {
        const colors = ['#f1f1f1', '#f3f3f3', '#f6f6f6', '#f9f9f9', '#e3e3e3', '#e6e6e6']
        clouds.push(new Cloud(colors[Math.floor(Math.random() * colors.length)]))
    }
    if (Math.random() < coinFrequency + _score_max * 0.0002) coins.push(new Coin())
    if (Math.random() < seojinFrequency + _score_max * 0.00002) seojins.push(new Seojin())
    if (Math.random() < yeejunFrequency + _score_max * 0.00003) {
        if (yeejuns.length <= 2) yeejuns.push(new Yeejun())
    }
    if (Math.random() < leeFrequency + _score_max * 0.00002) {
        if (lees.length <= 1) lees.push(new Lee())
    }

    handleClouds()
    handleCoins()
    handleSeojins()
    handleYeejuns()
    handleLees()
    handleParticles()

    if (score <= 50 && score % 5 === 0) cloudSpeed += 0.00025

    if (messageTimer > 0) {
        messageTimer--
        if (messageTimer === 0) messageBox.innerText = ''
    }

    if (messageTimer2 > 0) {
        messageTimer2--
        if (messageTimer2 === 0) messageBox2.innerText = ''
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

    if (score == 20 || score == 25) {
        displayMessage2('F 스킬 사용 가능!')
    }

    if (!free && score > 200) {
        stopSpeed = 0
        winds = []
    }

    requestAnimationFrame(gameLoop);
}

const startGame = () => {
    startScreen.style.display = 'none';
    gameLoop();
}

const startFreeGame = () => {
    startScreen.style.display = 'none';
    free = true
    gameLoop();
}

const toggleHanam = () => {
    if (is_hanamja && inv) {
        is_hanamja = false
        inv = false
        document.getElementById('hanam').innerText = '무적모드 사용 (하남자모드;;;)'
    } else {
        is_hanamja = true
        inv = true
        document.getElementById('hanam').innerText = '하남자모드 사용됨'
    }
}

const toggleBackground = () => {
    if (use_background) {
        use_background = false
        document.getElementById('backg').innerText = '배경 사용안함'
    } else {
        use_background = true
        document.getElementById('backg').innerText = '배경 사용'
    }
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
        case ' ':
            cloudSpeed = 12
            player.fast_down = true
            break;
        case 'f':
            if (!player.is_player_saying && player.player_f_cooltime == 0) {
                if (score >= 20) {
                    player.is_player_saying = true
                    player.player_f_cooltime = 600

                    player.playerDisplayMessage(player_messages[Math.floor(Math.random() * player_messages.length)], 540)
                    displayMessage('애국심을 포기하고 대한민국에 요청하여 구름을 제거하였읍니다.', 540)
                    clouds.forEach((cloud, _) => {
                        particle(cloud.x, cloud.y)
                    })
                    clouds = []

                    particle(player.x, player.y, ['#ff0000'])
                }
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (['a', 'd', 'q', 'e'].includes(e.key)) player.dx = 0;
    if (e.key == ' ') {
        cloudSpeed = 7
        player.fast_down = false
    }
});
