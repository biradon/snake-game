const board = document.getElementById("game-board")

const gridSize = 20
let snake = [{x: 10, y: 10}]
let food = generateFood()
let direction = 'right'


function draw() {
    board.innerHTML = ''
    drawSnake()
    drawFood()
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


draw()

function drawFood() {
    const foodElement = createGameElement('div', 'food')
    setPosition(foodElement, food)
    board.appendChild(foodElement)
}

function generateFood() {
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

    snake.pop()
}


setInterval(() => {
    move()
    draw()
}, 200)