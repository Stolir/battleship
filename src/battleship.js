export const BOARD_SIZE = [8, 8];

export class Ship {
  constructor(length, start=null, orientation=null) {
    this.length = length;
    this.hits = 0;
    this.location = 
    {
      start: start,
      orientation: orientation
    };
  }

  setLocation(start, orientation) {
    if(start && orientation) {
      const newLocation = {};
      newLocation.start = start;
      newLocation.orientation = orientation;
      this.location = newLocation
    }
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

export class Gameboard {
  constructor() {
    this.board = this.#generateBoard();
    this.ships = {
      destroyer: new Ship(2),
      submarine: new Ship(3),
      cruiser: new Ship(3),
      battleship: new Ship(4),
      carrier: new Ship(5),
    };
  }

  #generateBoard() {
    const board = [];
    for (let i = 0; i < BOARD_SIZE[0]; i++) {
      board.push(Array(BOARD_SIZE[1]).fill(""));
    }
    return board;
  }

  placeShip(coordinates, shipName, orientation) {
    if (!this.#isValidShip(shipName)) {
      throw new Error("Invalid ship name");
    }

    const ship = this.ships[shipName];
    const cells = Gameboard.getCells(coordinates, ship.length, orientation);

    if (!this.#isInBounds(cells)) {
      throw new Error("Position out of bounds");
    }
    if (!this.#isVacant(cells)) {
      throw new Error("Position already occupied");
    }
    for (let [row, col] of cells) {
      this.board[row][col] = ship;
    }
    ship.setLocation(coordinates, orientation)
  }

  recieveAttack(coordinates) {
    if (!this.#isInBounds([coordinates])) {
      throw new Error("Position out of bounds");
    }
    let cell = this.board[coordinates[0]][coordinates[1]];
    if (cell instanceof Ship) {
      cell.hit();
    } else if (!cell) {
      this.board[coordinates[0]][coordinates[1]] = "missed";
    }
    return this.board[coordinates[0]][coordinates[1]];
  }

  isLost() {
    const ships = Object.keys(this.ships);
    const sunkShips = [];
    for (let ship of ships) {
      if (this.ships[ship].isSunk()) {
        sunkShips.push(ship);
      }
    }
    if (ships.length === sunkShips.length) {
      return true;
    }
    return false;
  }

  #isInBounds(cells) {
    for (let [row, col] of cells) {
      if (!(row <= 7 && row >= 0) || !(col <= 7 && col >= 0)) {
        return false;
      }
    }
    return true;
  }

  #isVacant(cells) {
    for (let [row, col] of cells) {
      if (this.board[row][col]) {
        return false;
      }
    }
    return true;
  }

  #isValidShip(shipName) {
    return this.ships[shipName];
  }

  static getCells(coordinates, shipSize, orientation) {
    const cells = [];
    if (orientation === "horizontal") {
      for (let i = 0; i < shipSize; i++) {
        cells.push([coordinates[0], coordinates[1] + i]);
      }
    } else {
      for (let i = 0; i < shipSize; i++) {
        cells.push([coordinates[0] + i, coordinates[1]]);
      }
    }
    return cells;
  }
}

export class Player {
  constructor(type) {
    this.gameboard = new Gameboard();
    this.type = type;
  }
}
