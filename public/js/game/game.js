import {
  update as updateSnake,
  draw as drawSnake,
  SNAKE_SPEED,
  getSnakeHead,
  snakeIntersection,
} from "./snake.js";
import { update as updateFood, draw as drawFood } from "./food.js";
import { outsideGrid } from "./grid.js";

let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById("game-board");

// draw fondations
console.log("sss");
fetch("./assets/js/game/graph.json")
  .then((response) => response.json())
  .then((jsonData) => {
    console.log("input success");
    const cells = jsonData["mxGraphModel"]["root"]["mxCell"];

    for (let i = 0; i < cells.length; i++) {
      const cellValue = cells[i]["_attributes"]["value"];
      if (
        cellValue === "貨架" ||
        cellValue === "牆壁" ||
        cellValue === "充電站" ||
        cellValue === "停車場" ||
        cellValue === "電梯"
      ) {
        let x = cells[i]["mxGeometry"]["_attributes"]["x"]
          ? cells[i]["mxGeometry"]["_attributes"]["x"]
          : 0;
        let y = cells[i]["mxGeometry"]["_attributes"]["y"]
          ? cells[i]["mxGeometry"]["_attributes"]["y"]
          : 0;
        x = x / 40;
        y = y / 40;
        const width = cells[i]["mxGeometry"]["_attributes"]["width"] / 40;
        const height = cells[i]["mxGeometry"]["_attributes"]["height"] / 40;
        //add to html view
        const foundationElement = document.createElement("div");
        foundationElement.style.gridRowStart = y + 1;
        foundationElement.style.gridColumnStart = x + 1;
        foundationElement.style.gridRowEnd = y + height + 1;
        foundationElement.style.gridColumnEnd = x + width + 1;
        switch (cellValue) {
          case "貨架":
            foundationElement.classList.add("block");
            break;
          case "牆壁":
            foundationElement.classList.add("wall");
            break;
          case "充電站":
            foundationElement.classList.add("charge");
            break;
          case "停車場":
            foundationElement.classList.add("park");
            break;
          case "電梯":
            foundationElement.classList.add("elevator");
            break;
        }
        gameBoard.appendChild(foundationElement);
      }
    }
  });

function main(currentTime) {
  if (gameOver) {
    if (confirm("You lost. Press ok to restart.")) {
      window.location = "/";
    }
    return;
  }

  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  // console.log(secondsSinceLastRender);
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

  lastRenderTime = currentTime;

  update();
  draw();
}

window.requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
  // checkDeath();
}

function draw() {
  // gameBoard.innerHTML = "";
  const elements = document.getElementsByClassName("snake");
  if (elements)
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  drawSnake(gameBoard);
  // drawFood(gameBoard);
}

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}
