const snakeBody = [{ x: 0, y: 0 }];

//socketio
const clearSnake = (agv) => {
  const elements = document.getElementById(agv);
  if (elements) elements.parentNode.removeChild(elements);
};

const drawSnake = (startToEnd, agv, status) => {
  const gameBoard = document.getElementById('game-board');

  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowEnd = segment.y + 1;
    snakeElement.style.gridColumnEnd = segment.x + 1;
    snakeElement.classList.add('snake');
    snakeElement.id = agv;
    gameBoard.appendChild(snakeElement);
  });

  const snake = document.getElementById(agv);
  if (startToEnd.includes('park')) snake.style.backgroundColor = 'green';
  else snake.style.backgroundColor = 'blue';
  if (status === 'stop') snake.style.backgroundColor = 'red';
};

const socket = io();
socket.on('agvRoute', (topic, message) => {
  message = JSON.parse(message);

  const startToEnd = message['startToEnd'];
  const agv = 'agv:' + topic.split(':')[1];
  const currentStep = message['currentStep'];
  const status = message['status'];
  const position = message['fullRoute'][currentStep];

  snakeBody[0]['x'] = parseInt(position[0]) + 1;
  snakeBody[0]['y'] = parseInt(position[1]) + 1;
  console.log(snakeBody[0]['x'], snakeBody[0]['y']);

  clearSnake(agv);

  drawSnake(startToEnd, agv, status);
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
