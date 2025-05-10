import { BOARD_SIZE, Player, Ship } from "./battleship";

const playerContainers = document.querySelectorAll(".game-display .playercontainer")
const playerBoardElm = document.querySelector(".game-display .player-container .board .game-area")
const opponentBoardElm = document.querySelector(".game-display .player-container.opponent .board game-area")

export function loadPlayerBoard(player){
  const shipWrappers = makeShips(player); 
  const playerBoard = player.gameboard.board;
  console.log(playerBoard)
  for (let i = 0; i < BOARD_SIZE[0]; i++) {
    for (let j = 0; j < BOARD_SIZE[1]; j++) {
      const cell = createElement("button");
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (playerBoard[i][j] && playerBoard[i][j] instanceof Ship) {
        const shipName = findKey(player.gameboard.ships, playerBoard[i][j])
        shipWrappers[shipName].appendChild(cell);
      } else {
        playerBoardElm.appendChild(cell);
      }
    }
  }
  for (let ship in shipWrappers) {
    playerBoardElm.appendChild(shipWrappers[ship])
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
function makeShips(player) {
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

function findKey(object, value) {
  return Object.keys(object).find(key => object[key] === value); 
}