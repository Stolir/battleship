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
}