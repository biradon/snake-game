const board = document.getElementById("game-board")
const score = document.getElementById('score')
const highScoreText = document.getElementById('highScore')
const explainText = document.getElementById("explain-text")
const logo = document.getElementById('logo')
const instruction = document.getElementById('instruction-text')

const gridSize = 20
let snake = [{x: 10, y: 10}]
let food = generateFood()
let wall = []
let star = generateStar()


let direction = 'right'
let gameInterval;
let gameSpeedDelay = 200
let gameStarted = false
let highScore = 0
let currentScore = 0
let doubleScoreState = false


function draw() {
    board.innerHTML = ''
    drawSnake()
    drawFood()
    drawWall()
    drawStar()
    updateScore()
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake')
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
    })
    
}

function createGameElement(tag, className) {
    const element = document.createElement(tag)
    element.className = className
    return element
}


// Set position of snake and food
function setPosition(element ,position) {
    element.style.gridColumnStart  = position.x
    element.style.gridRowStart  = position.y
}


function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food')
        setPosition(foodElement, food)
        board.appendChild(foodElement)
    }
}

function drawWall() {
    wall.forEach((segment) => {
        const wallElement = createGameElement('div', 'wall')
        setPosition(wallElement, segment)
        board.appendChild(wallElement)
    })
}

function drawStar() {
    if (gameStarted) {
        const starElement = createGameElement('div', 'star')
        setPosition(starElement, star)
        board.appendChild(starElement)
    }
}


function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y}
}


function generateWall() {
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y}
}

function generateStar() {
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y}
}



function move() {
    const head = {...snake[0]}
    switch (direction) {
        case 'up':
            head.y--
            break
        case 'down':
            head.y++
            break
        case 'left':
            head.x--
            break
        case 'right':
            head.x++
            break
    }
    snake.unshift(head)

    if (head.x === star.x && head.y === star.y) {
        activateDoublePoints()
        star = {}
    }


    if (head.x === food.x && head.y === food.y) {
        if (doubleScoreState) {
            currentScore += 2
        } else {
            currentScore++
        }
        food = generateFood()
        while (wall.some(item => item.x === food.x && item.y === food.y)) {
            food = generateFood()
        }
        increaseSpeed()
        checkCollision()
        if (snake.length % 2 == 0) {
            extraWall = generateWall()
            wall.push(extraWall)
            console.log(wall)
        }
        if (snake.length % 9 == 0) {
            star = generateStar()
        }
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {
            move()
            checkCollision()
            draw()
        }, gameSpeedDelay)
    } 
    else {
        snake.pop()
    }
}



function startGame() {
    gameStarted = true
    explainText.style.display = 'none'
    logo.style.display = 'none'
    instruction.style.display = 'none'
    gameInterval = setInterval(() => {
        move()
        checkCollision()
        draw()
    }, gameSpeedDelay)
}


// Keypress event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.code === ' ')) {
        startGame()
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break
            case 'ArrowDown':
                direction = 'down'
                break
            case 'ArrowRight':
                direction = 'right'
                break
            case 'ArrowLeft':
                direction = 'left'
                break
        }
    }
}

document.addEventListener('keydown', handleKeyPress)


function increaseSpeed() {
    console.log(gameSpeedDelay)
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1
    }
}


function checkCollision() {
    const head = snake[0];
  
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      resetGame();
    }

    if (head.x == wall.x && head.y == wall.y) {
        resetGame();
      }
  
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame();
      }
    }

    for (let i = 0; i < wall.length; i++) {
        if (head.x === wall[i].x && head.y === wall[i].y) {
          resetGame();
        }
      }
  }


function resetGame() {
    updateHighsScore()
    stopGame()
    snake = [{x: 10, y: 10}]
    food = generateFood()
    wall = []
    direction = 'right'
    gameSpeedDelay = 200
    updateScore()
}

function updateScore() {
    // const currentScore = snake.length - 1
    score.textContent  = currentScore.toString().padStart(3, '0')
}

function stopGame() {
    clearInterval(gameInterval)
    explainText.style.display = 'block'
    logo.style.display = 'block'
    instruction.style.display = 'block'
    gameStarted = false
}

function updateHighsScore() {
    if (currentScore > highScore) {
        highScore = currentScore
        highScoreText.textContent = highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block'
}

function activateDoublePoints() {
    doubleScoreState = true
    let timeLeft = 10
    const countDown = setInterval(() => {
        explainText.style.display = 'block'
        explainText.innerHTML = `🔥 Double Points Active for ${timeLeft} Seconds! 🔥`
        timeLeft--

        if (timeLeft < 0) {
            clearInterval(countDown)
            doubleScoreState = false
            explainText.style.display = 'none'
            explainText.innerHTML = "Eat food ⚪ Doge wall 🟥 X2 Point 🟡"
        }
    }, 1000)
}

 