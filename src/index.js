import "./styles.css"
import { Player, Ship } from "./battleship"
import { loadOpponentBoard, loadPlayerBoard, makeShips, renderAttack,  } from "./DOMLoader"

// make players temporarily for testing
const player1 = new Player("player")
const playerBoard = player1.gameboard;
playerBoard.placeShip([0,7], "destroyer", "vertical");
playerBoard.placeShip([1,1], "submarine", "horizontal");
playerBoard.placeShip([3,1], "carrier", "vertical");
playerBoard.placeShip([3,4], "battleship", "horizontal");
playerBoard.placeShip([6,5], "cruiser", "horizontal");

const player2 = new Player("cpu")
const opponentBoard = player2.gameboard;
opponentBoard.placeShip([0,7], "destroyer", "vertical");
opponentBoard.placeShip([1,1], "submarine", "horizontal");
opponentBoard.placeShip([3,1], "carrier", "vertical");
opponentBoard.placeShip([3,4], "battleship", "horizontal");
opponentBoard.placeShip([6,5], "cruiser", "horizontal");

const playerBoardElm = document.querySelector(".game-display .player-container .board .game-area")
const opponentBoardElm = document.querySelector(".game-display .player-container.opponent .board .game-area")

const playerShipWrappers = makeShips(player1)
const opponentShipWrappers = makeShips(player2)

window.addEventListener("load", () => {
  loadPlayerBoard(player1, playerBoardElm, playerShipWrappers)
  loadOpponentBoard(opponentBoardElm)
})

opponentBoardElm.addEventListener("mouseup", (event) => {
    const cell = event.target.closest("button")
    renderAttack(cell, opponentBoard, opponentBoardElm, opponentShipWrappers)
})

playerBoardElm.addEventListener("mouseup", (event) => {
    const cell = event.target.closest("button")
    renderAttack(cell, playerBoard, playerBoardElm, playerShipWrappers)
})