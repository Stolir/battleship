import { BOARD_SIZE, Gameboard, Player, Ship } from "./battleship";

const playerContainers = document.querySelectorAll(".game-display .playercontainer")

export function loadPlayerBoard(player, boardElement, shipWrappers){
  const playerBoard = player.gameboard.board;
  for (let i = 0; i < BOARD_SIZE[0]; i++) {
    for (let j = 0; j < BOARD_SIZE[1]; j++) {
      const cell = createElement("button");
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (playerBoard[i][j] && playerBoard[i][j] instanceof Ship) {
        const shipName = findKey(player.gameboard.ships, playerBoard[i][j])
        shipWrappers[shipName].appendChild(cell);
      } else {
        boardElement.appendChild(cell);
      }
    }
  }
  for (let ship in shipWrappers) {
    boardElement.appendChild(shipWrappers[ship])
  }
}

export function loadOpponentBoard(boardElement) {
  for (let i = 0; i < BOARD_SIZE[0]; i++) {
    for (let j = 0; j < BOARD_SIZE[1]; j++) {
      const cell = createElement("button");
      cell.dataset.row = i;
      cell.dataset.col = j;
      boardElement.appendChild(cell);
    }
  }
}

export function renderAttack(cell, board, boardElement, shipWrappers){
    const coordinates = [cell.dataset.row, cell.dataset.col]
    const attacked = (board.recieveAttack(coordinates))
    // disable button and add disabled class for styling
    cell.disabled = true;
    cell.classList.add("disabled")
    // check if target was a ship to render a hit
    if (attacked instanceof Ship) {
      cell.classList.add("hit")
      // check whether targeted ship is sunk or not and render borders if true
      if (attacked.isSunk()) {
        const cells = Gameboard.getCells(attacked.location.start, attacked.length, attacked.location.orientation)
        const shipName = findKey(board.ships, attacked)
        for (let [row, col] of cells) {
          const shipCell = boardElement.querySelector(`button.disabled.hit[data-row="${row}"][data-col="${col}"]`)
          shipWrappers[shipName].appendChild(shipCell)
        }
        shipWrappers[shipName].classList.add("sunk")
        boardElement.appendChild(shipWrappers[shipName])
      }
    } else {
      cell.classList.add("miss")
    }
}

function createElement(elm, classNames=undefined, textContent="") {
  const element = document.createElement(elm)
  if (classNames) {
    for (let className of classNames) {
      element.classList.add(className)
    }
  }
  if (textContent) {
    element.textContent = textContent
  }
  return element;
}

// make ship wrappers to use in loadBoard()
export function makeShips(player) {
  if (!player instanceof Player) {
    throw new TypeError("Object of type Player is required")
  }
  const shipElelemts = {}
  const playerShips = player.gameboard.ships;
  for (let ship in playerShips) {
    shipElelemts[ship] = createElement("div", ["ship"])
  }
  // add the grid-area and grid-template-row/columns to each element
  for (let ship in shipElelemts) {
    let ShipLocation = playerShips[ship].location;
    if (playerShips[ship].location.orientation === "vertical") {
      shipElelemts[ship].setAttribute(
        'style', `grid-area: ${ShipLocation.start[0] + 1} / ${ShipLocation.start[1] + 1} / span ${playerShips[ship].length} / ${ShipLocation.start[1] + 1}; grid-template-rows: repeat(${playerShips[ship].length}, 1fr)`
      )
    } else {
      shipElelemts[ship].setAttribute(
        'style', `grid-area: ${ShipLocation.start[0] + 1} / ${ShipLocation.start[1] + 1} / ${ShipLocation.start[0] + 1} / span ${playerShips[ship].length}; grid-template-columns: repeat(${playerShips[ship].length}, 1fr)`
      )
    }
  }
  return shipElelemts;
}

export function findKey(object, value) {
  return Object.keys(object).find(key => object[key] === value); 
}