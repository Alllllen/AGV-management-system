import { getInputDirection } from './input.js';

export const SNAKE_SPEED = 1;
const snakeBody = [{ x: 1, y: 1 }];
let newSegments = 0;
let route = [
  '2,16',
  '3,16',
  '4,16',
  '5,16',
  '6,16',
  '7,16',
  '8,16',
  '9,16',
  '10,16',
  '11,16',
  '12,16',
  '13,16',
  '14,16',
  '14,17',
  '13,17',
  '12,17',
  '11,17',
  '10,17',
  '9,17',
  '9,18',
];
let route2 = [
  '36,9',
  '36,8',
  '35,8',
  '35,11',
  '35,12',
  '35,17',
  '35,18',
  '34,18',
  '33,18',
  '33,19',
];
let num = 0;
export function update() {
  addSegments();

  const inputDirection = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  // snakeBody[0].x += inputDirection.x;
  // snakeBody[0].y += inputDirection.y;
  let dir = route[num % route.length].split(',');
  console.log(snakeBody[0].x, snakeBody[0].y);
  // console.log(dir[0], dir[1]);
  snakeBody[0]['x'] = parseInt(dir[0]) + 1;
  snakeBody[0]['y'] = parseInt(dir[1]) + 1;
  num++;
}

export function draw(gameBoard) {
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowEnd = segment.y + 1;
    snakeElement.style.gridColumnEnd = segment.x + 1;
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });
}

export function expandSnake(amount) {
  newSegments += amount;
}

export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPositions(segment, position);
  });
}

export function getSnakeHead() {
  return snakeBody[0];
}

export function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }

  newSegments = 0;
}
