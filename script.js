const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const scoreBoard = document.getElementById('scoreBoard')
const gravity = document.getElementById('gravity')
const fcooltime = document.getElementById('fcooltime')
const messageBox = document.getElementById('message')
const startScreen = document.getElementById('startScreen')

let score = 0,
    gameOver = false,
    cloudSpeed = 5,
    gravityScore = 1,
    cloudFrequency = 0.01,
    coinFrequency = 0.005
let messageTimer = 0
let player_messageTimer = 0
let player_f_cooltime = 0

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 50,
    baseY: canvas.height / 2 - 200,
    width: 100,
    height: 100,
    dx: 0,
    dy: 0,
    amplitude: 20,
    angle: 0,
    image: new Image(),
    msg: ['', ''],
    is_player_saying: false,
}
player.image.src = './resources/player.png'

const player_messages = [
    ['你在说什么？你上次说中华人民共和国应该解散了', '무슨 소리야? 너가 저번에 중화인민공화국이 해체되어야 한다고 말했잖아'],
    ['上次说要为香港示威加油的是什么?', '그럼 홍콩 시위를 응원한다고 말했던건 뭐야?'],
    ['那么习近平什么时候才会恶毒呢？', '그래서 시진핑은 언제 암살할거야?'],
    ['你如何支持中国的民主化令人惊讶。', '중국의 민주화를 응원하다니 정말 대단해'],
    ['我爱北京天安门', '나는 베이징 천안문을 사랑해'],
]

let clouds = [],
    coins = []
const coinImage = new Image()
coinImage.src = './resources/coin.png'

const gameOverImage = new Image()
gameOverImage.src = './resources/drum.png'

document.addEventListener('keydown', (e) => {
    if (e.key === 'a') player.dx = -7
    else if (e.key === 'd') player.dx = 7
    else if (e.key === 'q') player.dx = -12
    else if (e.key === 'e') player.dx = 12
    else if (e.key === 'f') {
        if (!player.is_player_saying && player_f_cooltime == 0) {
            if (score >= 30) {
                player.is_player_saying = true
                player_f_cooltime = 600

                playerDisplayMessage(player_messages[Math.floor(Math.random() * player_messages.length)])
                console.log(clouds)
                clouds = []
            }
        }
    }
})
document.addEventListener('keyup', (e) => {
    if (e.key == 'a' || e.key == 'd' || e.key == 'q' || e.key == 'e') {
        player.dx = 0
        player.dy = 0
    }
})

function displayMessage(text, t = 180) {
    messageBox.innerText = text
    messageTimer = t
}

function playerDisplayMessage(text, t = 180) {
    player.msg = text
    player_messageTimer = t
}

const windEffects = []

function createWindEffect() {
    const x = Math.random() * canvas.width
    const width = 1 + Math.random() * 3
    const height = Math.random() * 30 + 50
    const speed = cloudSpeed + Math.random() * 10

    const xDirection = Math.random() > 0.5 ? 1 : -1
    const offsetX = Math.random() * canvas.width * 0.3

    windEffects.push({ x: x + offsetX * xDirection, y: canvas.height, width, height, speed })
}

function handleWindEffects() {
    windEffects.forEach((wind, index) => {
        wind.y -= wind.speed
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(wind.x, wind.y, wind.width, wind.height)

        if (wind.y < -50) windEffects.splice(index, 1)
    })
}

function createCloud() {
    const x = Math.random() * (canvas.width - 150)
    const y = canvas.height + Math.random() * 100
    const rectangles = []
    const numRects = 5 + Math.floor(Math.random() * 4)

    for (let i = 0; i < numRects; i++) {
        rectangles.push({
            offsetX: Math.random() * 50 - 25,
            offsetY: Math.random() * 30 - 15,
            width: Math.random() * 60 + 40,
            height: Math.random() * 30 + 20,
        })
    }

    clouds.push({ x, y, rectangles })
}

function createCoin() {
    const x = Math.random() * (canvas.width - 50)
    const y = canvas.height + Math.random() * 100
    coins.push({ x, y, width: 40, height: 40 })
}

function collisionDetection(player, object) {
    return (
        player.x < object.x + object.width &&
        player.x + player.width > object.x &&
        player.y < object.y + object.height &&
        player.y + player.height > object.y
    )
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200)
        ctx.font = "50px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("Gay Over 😭", canvas.width / 2 - 130, canvas.height / 2 + 120)

        return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    player.x += player.dx
    player.y = player.baseY + Math.sin(player.angle) * player.amplitude
    player.angle += 0.05

    if (player.x < 0) player.x = 0
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width
    if (player.y < 0) player.y = 0
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height

    if (Math.random() < 0.02) {
        createWindEffect()
        createWindEffect()
    }

    handleWindEffects()

    ctx.drawImage(player.image, player.x, player.y, player.width, player.height)

    ctx.font = '20px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(player.msg[0], player.x + player.width / 2 - ctx.measureText(player.msg[0]).width / 2, player.y + player.height + 30)
    ctx.fillText(player.msg[1], player.x + player.width / 2 - ctx.measureText(player.msg[1]).width / 2, player.y + player.height + 60)

    if (Math.random() < cloudFrequency + score * 0.0005) createCloud()
    if (Math.random() < coinFrequency + score * 0.0002) createCoin()

    clouds.forEach((cloud, index) => {
        cloud.y -= cloudSpeed
        ctx.fillStyle = '#FFF'
        cloud.rectangles.forEach((rect) => {
            ctx.fillRect(cloud.x + rect.offsetX, cloud.y + rect.offsetY, rect.width, rect.height)
        })

        cloud.rectangles.forEach((rect) => {
            const rectX = cloud.x + rect.offsetX
            const rectY = cloud.y + rect.offsetY
            if (collisionDetection(player, { x: rectX, y: rectY, width: rect.width, height: rect.height })) {
                gameOver = true
            }
        })

        if (cloud.y < -50) clouds.splice(index, 1)
    })

    coins.forEach((coin, index) => {
        coin.y -= cloudSpeed
        ctx.drawImage(coinImage, coin.x, coin.y, coin.width, coin.height)

        if (collisionDetection(player, coin)) {
            score += 5
            scoreBoard.innerText = `Social Credit (점수): ${score}`
            coins.splice(index, 1)

            if (score <= 50 && score % 10 === 0) {
                displayMessage('중력의 양이 증가합니다!')
                gravityScore *= 1.5
                gravity.innerText = `중력: x${gravityScore}`
                if (score == 50) {
                    displayMessage('중력의 양이 최대치에 도달했습니다!!')
                    gravity.innerText = `중력: x${gravityScore} (MAX)`
                }
            }
        }

        if (coin.y < -50) coins.splice(index, 1)
    })

    if (score <= 50 && score % 10 === 0) cloudSpeed += 0.005

    if (messageTimer > 0) {
        messageTimer--
        if (messageTimer === 0) messageBox.innerText = ''
    }

    if (player_f_cooltime > 0) {
        player_f_cooltime--
        if (player_f_cooltime === 0) {
            fcooltime.innerText = `F 쿨타임: 사용 가능`
        } else {
            fcooltime.innerText = `F 쿨타임: ${Math.round(player_f_cooltime / 60)}s`
        }
    }

    if (player_messageTimer > 0) {
        player_messageTimer--
        if (player_messageTimer === 0) {
            player.is_player_saying = false
            player.msg = ['', '']
        }
    }

    requestAnimationFrame(gameLoop)
}

function startGame() {
    startScreen.style.display = 'none'
    gameLoop()
}
