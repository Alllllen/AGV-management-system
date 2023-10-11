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

socket.on('complete', (topic) => {
  const agv = 'agv:' + topic.split('/')[2];
  clearSnake(agv);
});
socket.on('parkNum', (message) => {
  message = JSON.parse(message);
  if (document.getElementById(message[0]))
    for (let park in message) {
      const parkElement = document.getElementById(park);
      parkElement.innerHTML = park + ': ' + message[park];
    }
});
socket.on('agv:status', (message) => {
  message = JSON.parse(message);
  console.log(message);
  if (document.getElementById('agvStatusPark')) {
    let agvStatusElement = document.getElementById('agvStatusPark');
    agvStatusElement.innerHTML = message[0];
    agvStatusElement = document.getElementById('agvStatusTransport');
    agvStatusElement.innerHTML = message[1];
    agvStatusElement = document.getElementById('agvStatusCharge');
    agvStatusElement.innerHTML = message[2];
  }
});
socket.on('agv:route', (message) => {
  message = JSON.parse(message);
  const topic = message.topic;
  const payload = message.payload;

  const startToEnd = payload['startToEnd'];
  const agv = 'agv:' + topic.split('/')[2];
  const currentStep = payload['currentStep'];
  const status = payload['status'];
  const position = payload['fullRoute'][currentStep];

  //...........................................................,.....原本的................................................................
  // message = JSON.parse(message);
  // console.log(message['data']);

  // const startToEnd = message['data']['startToEnd'];
  // const agv = 'agv:' + message['id'];
  // const currentStep = message['data']['currentStep'];
  // const status = message['data']['status'];
  // const position = message['data']['fullRoute'][currentStep];

  //......................................................................................................................................
  snakeBody[0]['x'] = parseInt(position[0]) + 1;
  snakeBody[0]['y'] = parseInt(position[1]) + 1;
  // console.log(snakeBody[0]['x'], snakeBody[0]['y']);
  clearSnake(agv);
  drawSnake(startToEnd, agv, status);
});
socket.on('door:status', (message) => {
  message = JSON.parse(message);
  const topic = message.topic;
  const payload = message.payload;
  // console.log(payload); //這裡跑出undefined!!!!

  const door = document.getElementById(payload['name']);
  if (payload['status'] === 'open') door.style.backgroundColor = 'transparent';
  if (payload['status'] === 'close') door.style.backgroundColor = '#1f1b1a';
});

// from mqtt (現在改成server讀取redis資料在傳過來)
// const client = mqtt.connect({ host: 'localhost', port: 8883, protocol: 'ws' });
// client.on('connect', () => client.subscribe('test'));

// socket.on('subscribeMqtt', (message) => client.subscribe(message));
// client.on('message', function (topic, message) {
//   message = JSON.parse(message);
//   // console.log(topic);

//   if (topic.includes('door')) {
//     const door = document.getElementById(message['name']);
//     if (message['status'] === 'open')
//       door.style.backgroundColor = 'transparent';

//     if (message['status'] === 'close') door.style.backgroundColor = '#1f1b1a';
//   }

//   if (topic.includes('route')) {
//     const startToEnd = message['startToEnd'];
//     const agv = 'agv:' + topic.split(':')[1];
//     const currentStep = message['currentStep'];
//     const status = message['status'];
//     const position = message['fullRoute'][currentStep];

//     snakeBody[0]['x'] = parseInt(position[0]) + 1;
//     snakeBody[0]['y'] = parseInt(position[1]) + 1;
//     // console.log(snakeBody[0]['x'], snakeBody[0]['y']);

//     clearSnake(agv);

//     drawSnake(startToEnd, agv, status);
//   }
// });

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
