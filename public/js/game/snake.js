const snakeBody = [{ x: 0, y: 0 }];

//socketio
const clearSnake = () => {
  const elements = document.getElementsByClassName('snake');
  if (elements)
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
};
const drawSnake = (message) => {
  const gameBoard = document.getElementById('game-board');

  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowEnd = segment.y + 1;
    snakeElement.style.gridColumnEnd = segment.x + 1;
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });

  const snake = document.getElementsByClassName('snake');
  if (message[1].toString().includes('park')) {
    for (let i = 0; i < snake.length; i++) {
      snake[i].style.backgroundColor = 'blue';
    }
  } else {
    for (let i = 0; i < snake.length; i++) {
      snake[i].style.backgroundColor = 'red';
    }
  }
};

const socket = io();
socket.on('agvPosition', (message) => {
  // addSegments();
  message = JSON.parse(message);

  snakeBody[0]['x'] = parseInt(message[0][0]) + 1;
  snakeBody[0]['y'] = parseInt(message[0][1]) + 1;
  console.log(snakeBody[0].x, snakeBody[0].y);

  clearSnake();

  drawSnake(message);
});

// export const SNAKE_SPEED = 100;

// import { getInputDirection } from './input.js';
// let newSegments = 0;

// export function update() {
//   addSegments();

//   const inputDirection = getInputDirection();
//   for (let i = snakeBody.length - 2; i >= 0; i--) {
//     snakeBody[i + 1] = { ...snakeBody[i] };
//   }

//   console.log(snakeBody[0].x, snakeBody[0].y);

//   // snakeBody[0]['x'] = parseInt(dir[0]) + 1;
//   // snakeBody[0]['y'] = parseInt(dir[1]) + 1;
// }
// export function draw(gameBoard) {
//   snakeBody.forEach((segment) => {
//     const snakeElement = document.createElement('div');
//     snakeElement.style.gridRowStart = segment.y;
//     snakeElement.style.gridColumnStart = segment.x;
//     snakeElement.style.gridRowEnd = segment.y + 1;
//     snakeElement.style.gridColumnEnd = segment.x + 1;
//     snakeElement.classList.add('snake');
//     gameBoard.appendChild(snakeElement);
//   });
// }

// export function expandSnake(amount) {
//   newSegments += amount;
// }

// export function onSnake(position, { ignoreHead = false } = {}) {
//   return snakeBody.some((segment, index) => {
//     if (ignoreHead && index === 0) return false;
//     return equalPositions(segment, position);
//   });
// }

// export function getSnakeHead() {
//   return snakeBody[0];
// }

// export function snakeIntersection() {
//   return onSnake(snakeBody[0], { ignoreHead: true });
// }

// function equalPositions(pos1, pos2) {
//   return pos1.x === pos2.x && pos1.y === pos2.y;
// }

// function addSegments() {
//   for (let i = 0; i < newSegments; i++) {
//     snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
//   }

//   newSegments = 0;
// }
