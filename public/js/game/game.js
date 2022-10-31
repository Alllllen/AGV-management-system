// draw fondations
const gameBoard = document.getElementById('game-board');
fetch('./js/game/graph.json')
  .then((response) => response.json())
  .then((jsonData) => {
    console.log('Map successfully loaded');

    const fetchData = (CellMxGeometry) => {
      let x = CellMxGeometry['x'] ? CellMxGeometry['x'] : 0;
      let y = CellMxGeometry['y'] ? CellMxGeometry['y'] : 0;
      x = x / 40;
      y = y / 40;
      const width = CellMxGeometry['width'] / 40;
      const height = CellMxGeometry['height'] / 40;
      // saveData(value, x, y, width, height);
      return {
        x,
        y,
        width,
        height,
      };
    };
    const cells = jsonData['mxGraphModel']['root']['mxCell'];

    for (let i = 0; i < cells.length; i++) {
      let cellValue = cells[i]['_attributes']['value'];
      if (!cellValue) continue;

      cellValue = cellValue.split('<span')[0];

      let val = fetchData(cells[i]['mxGeometry']['_attributes']);
      let x = val['x'];
      let y = val['y'];
      let width = val['width'];
      let height = val['height'];

      //add to html view
      const foundationElement = document.createElement('div');
      foundationElement.style.gridRowStart = y + 1;
      foundationElement.style.gridColumnStart = x + 1;
      foundationElement.style.gridRowEnd = y + height + 1;
      foundationElement.style.gridColumnEnd = x + width + 1;
      if (
        cellValue.includes('b') &&
        !cellValue.includes('e') &&
        !cellValue.includes('s')
      ) {
        foundationElement.classList.add('block');
        foundationElement.innerHTML = cellValue;
      }
      if (cellValue.includes('w')) foundationElement.classList.add('wall');
      if (cellValue.includes('c') && !cellValue.includes('e')) {
        foundationElement.classList.add('charge');
        foundationElement.id = cellValue;
        foundationElement.innerHTML = cellValue;
      }
      if (cellValue.includes('p') && !cellValue.includes('e')) {
        foundationElement.classList.add('park');
        foundationElement.id = cellValue;
        foundationElement.innerHTML = cellValue;
      }
      if (cellValue.includes('l') && !cellValue.includes('e')) {
        foundationElement.classList.add('elevator');
        foundationElement.id = cellValue;
        foundationElement.innerHTML = cellValue;
      }
      if (cellValue.includes('d')) {
        foundationElement.classList.add('door');
        foundationElement.id = cellValue;
        foundationElement.innerHTML = cellValue;
      }

      gameBoard.appendChild(foundationElement);
    }
  });

// import {
//   update as updateSnake,
//   draw as drawSnake,
//   getSnakeHead,
//   snakeIntersection,
//   SNAKE_SPEED,
// } from './snake.js';
// import { update as updateFood, draw as drawFood } from './food.js';
// import { outsideGrid } from './grid.js';

// let lastRenderTime = 0;
// let gameOver = false;
// const gameBoard = document.getElementById('game-board');

// //main
// function main(currentTime) {
//   if (gameOver) {
//     if (confirm('You lost. Press ok to restart.')) {
//       window.location = '/';
//     }
//     return;
//   }

//   window.requestAnimationFrame(main);
//   const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
//   // console.log(secondsSinceLastRender);
//   if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

//   lastRenderTime = currentTime;

//   // update();
//   // updateSnake();
//   // draw();
// }

// window.requestAnimationFrame(main);

// function update() {
//   // updateSnake();
//   // updateFood();
//   // checkDeath();
// }

// function draw() {
//   // gameBoard.innerHTML = "";
//   const elements = document.getElementsByClassName('snake');
//   if (elements)
//     while (elements.length > 0) {
//       elements[0].parentNode.removeChild(elements[0]);
//     }
//   // drawSnake(gameBoard);
//   // drawFood(gameBoard);
// }

// function checkDeath() {
//   gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
// }
