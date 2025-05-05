export const BOARD_SIZE = [8, 8];

export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  isSunk() {
    return this.hits >= this.length;
  }

  hit() {
    if (this.hits >= this.length) {
      return;
    } else {
      this.hits++;
    }
  }
}

export class Gameboard{
  constructor(){
    this.board = this.#generateBoard();
  }

  #generateBoard() {
    let board = [];
    for (let i = 0; i < BOARD_SIZE[0]; i++) {
      board.push([]);
    }

    for (let row of board) {
      row.length = BOARD_SIZE[1];
    }
    return board;
  }

  placeShip(coordinates, shipSize, orientation) {
    const ship = new Ship(shipSize)
    if (orientation === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0]][coordinates[1] + i] = ship
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.board[coordinates[0] + i][coordinates[1]] = ship
      }
    }
  }

  recieveAttack(coordinates) {
    let cell = this.board[coordinates[0]][coordinates[1]]
    if (cell instanceof Ship) {
      cell.hit();
      cell = "hit"
    }
    else if (!cell) {
      cell = "missed"
    }
    return cell;
  }
}