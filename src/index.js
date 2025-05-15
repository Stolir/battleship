import "./styles.css";
import { Player, cpuPlayer, Ship } from "./battleship";
import {
  loadOpponentBoard,
  loadPlayerBoard,
  makeShips,
  renderAttack,
  player1,
  player2,
  resetGame,
} from "./DOMLoader";

// needed to make programatic clicks bubble
const mouseupEvent = new MouseEvent("mouseup", {
  bubbles: true, // Ensures event propagates up
  cancelable: true,
  view: window,
});

// make players temporarily for testing
const player = new Player();
const playerBoard = player.gameboard;
player.randomizeShips();

const cpu = new cpuPlayer();
const opponentBoard = cpu.gameboard;
cpu.randomizeShips();

const playerBoardElm = document.querySelector(
  ".game-display .player-container .board .game-area",
);
const opponentBoardElm = document.querySelector(
  ".game-display .player-container.opponent .board .game-area",
);

const playerReports = document.querySelector(".player-container .reports");
const opponentReports = document.querySelector(
  ".player-container.opponent .reports",
);

let playerShipWrappers = makeShips(player);
let opponentShipWrappers = makeShips(cpu);

// Manage turns
opponentBoardElm.classList.toggle("disable-board");
playerBoardElm.classList.toggle("disable-board");

window.addEventListener("load", () => {
  loadPlayerBoard(player, playerBoardElm, playerShipWrappers);
  loadOpponentBoard(opponentBoardElm);
});

opponentBoardElm.addEventListener("mouseup", (event) => {
  const cell = event.target.closest("button");
  renderAttack(
    cell,
    opponentBoard,
    opponentBoardElm,
    opponentShipWrappers,
    playerReports,
  );
  opponentBoardElm.classList.toggle("disable-board");
  playerBoardElm.classList.toggle("disable-board");
  let cpuAttackCell;
  do {
    const cpuAttackCoordinates = cpu.attackNextCell(playerBoard.board);
    cpuAttackCell = playerBoardElm.querySelector(
      `button[data-row="${cpuAttackCoordinates[0]}"][data-col="${cpuAttackCoordinates[1]}"]`,
    );
  } while (cpuAttackCell.disabled === true);
  cpuAttackCell.dispatchEvent(mouseupEvent);
});

playerBoardElm.addEventListener("mouseup", (event) => {
  const cell = event.target.closest("button");
  renderAttack(
    cell,
    playerBoard,
    playerBoardElm,
    playerShipWrappers,
    opponentReports,
  );
  opponentBoardElm.classList.toggle("disable-board");
  playerBoardElm.classList.toggle("disable-board");
});

// button functionality
const restartButton = document.querySelector("#game-over #restart");

restartButton.addEventListener("click", () => {
  location.reload();
});

const randomizeButton = document.querySelector("#randomize-ships");
randomizeButton.addEventListener("click", () => {
  console.log("click");
  playerBoard.resetBoard();
  player.randomizeShips();
  playerBoardElm.textContent = "";
  playerShipWrappers = makeShips(player);
  loadPlayerBoard(player, playerBoardElm, playerShipWrappers);
});

const startButton = document.querySelector("#start-game");
startButton.addEventListener("click", () => {
  startButton.disabled = true;
  startButton.classList.add("disabled");
  randomizeButton.disabled = true;
  randomizeButton.classList.add("disabled");
  opponentBoardElm.classList.remove("disable-board");
});
