export const BOARD_SIZE = [8, 8];

export class Ship {
  constructor(length, start = null, orientation = null) {
    this.length = length;
    this.hits = 0;
    this.location = {
      start: start,
      orientation: orientation,
    };
  }

  setLocation(start, orientation) {
    if (start && orientation) {
      const newLocation = {};
      newLocation.start = start;
      newLocation.orientation = orientation;
      this.location = newLocation;
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

  resetBoard() {
    this.board = [];
    this.board = this.#generateBoard();
  }

  placeShip(coordinates, shipName, orientation) {
    if (!this.#isValidShip(shipName)) {
      return "Invalid ship name";
    }
    const ship = this.ships[shipName];
    const cells = Gameboard.getCells(coordinates, ship.length, orientation);
    if (!this.isInBounds(cells)) {
      return "Position out of bounds";
    }
    if (!this.#isVacant(cells)) {
      return "Position already occupied";
    }

    for (let [row, col] of cells) {
      this.board[row][col] = ship;
    }
    ship.setLocation(coordinates, orientation);
  }

  recieveAttack(coordinates) {
    if (!this.isInBounds([coordinates])) {
      return "Position out of bounds";
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

  getRandomPosition(shipSize) {
    const coordinates = [
      Math.floor(Math.random() * BOARD_SIZE[0]),
      Math.floor(Math.random() * BOARD_SIZE[1]),
    ];
    const orientations = ["horizontal", "vertical"];
    // set orientation to horizontal/vertical based on number
    const shuffledOrientations = orientations.sort(() => Math.random() - 0.5);
    for (let orientation of shuffledOrientations) {
      if (this.#isLegal(coordinates, shipSize, orientation)) {
        return { coordinates, orientation };
      }
    }
    return this.getRandomPosition(shipSize);
  }

  #isLegal(coordinates, shipSize, orientation) {
    const cells = Gameboard.getCells(coordinates, shipSize, orientation);
    if (!this.isInBounds(cells) || !this.#isVacant(cells)) {
      return false;
    }
    return true;
  }

  isInBounds(cells) {
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
  constructor() {
    this.gameboard = new Gameboard();
    this.type = "player";
  }

  randomizeShips() {
    const ships = this.gameboard.ships;
    for (let ship in ships) {
      const position = this.gameboard.getRandomPosition(ships[ship].length);
      this.gameboard.placeShip(
        position.coordinates,
        ship,
        position.orientation,
      );
    }
  }
}

export class cpuPlayer extends Player {
  constructor() {
    super();
    this.type = "cpu";
    this.previouslyAttacked = [];
    this.currentTarget;
    this.attackQueues = {
      horizontal: [],
      vertical: [],
    };
  }
  // works well but only issue is it does not remember if it hit other ships while targeting a certain one it will forget about them as soon as target is sunk
  attackNextCell(enemyBoard) {
    if (this.currentTarget && this.currentTarget.isSunk()) {
      this.clearQueues()
    }
    let attack;
    const queues = this.attackQueues;
    if (queues.horizontal.length === 0 && queues.vertical.length === 0) {
      attack = this.attackRandomCell();
      if (enemyBoard[attack[0]][attack[1]] instanceof Ship) {
        this.previouslyAttacked.push(attack);
        this.currentTarget = enemyBoard[attack[0]][attack[1]]
        const horizontalCells = this.attackAdjacentCells(attack, "horizontal")
        const verticalCells = this.attackAdjacentCells(attack, "vertical")
        this.queueAttack(horizontalCells, this.attackQueues.horizontal);
        this.queueAttack(verticalCells, this.attackQueues.vertical);
      }
    } else if (queues.horizontal.length > 0) {
      attack = this.dequeueAttack(this.attackQueues.horizontal);
      if (enemyBoard[attack[0]][attack[1]] instanceof Ship) {
        this.previouslyAttacked.push(attack);
        const horizontalCells = this.attackAdjacentCells(attack, "horizontal");
        this.queueAttack(horizontalCells, this.attackQueues.horizontal);
      } 
    } else if (queues.vertical.length > 0) {
      attack = this.dequeueAttack(this.attackQueues.vertical);
      if (enemyBoard[attack[0]][attack[1]] instanceof Ship) {
        this.previouslyAttacked.push(attack);
        const verticalCells = this.attackAdjacentCells(attack, "vertical");
        this.queueAttack(verticalCells, this.attackQueues.vertical);
      }
    }
    // if (this.currentTarget && this.currentTarget !== enemyBoard[attack[0]][attack[1]]) {
    //   this.currentTarget = enemyBoard[attack[0]][attack[1]]
    // }
    return attack;
  }

  attackAdjacentCells(coordinates, direction = "horizontal") {
    if (direction === "horizontal") {
      const horizontalCells = [];
      for (let cells of [
        [coordinates[0], coordinates[1] + 1],
        [coordinates[0], coordinates[1] - 1],
      ]) {
        if (
          this.gameboard.isInBounds([cells]) &&
          !this.#isPreviouslyAttacked(cells)
        ) {
          horizontalCells.push(cells);
        }
      }
      return horizontalCells;
    } else {
      const verticalCells = [];
      for (let cells of [
        [coordinates[0] + 1, coordinates[1]],
        [coordinates[0] - 1, coordinates[1]],
      ]) {
        if (
          this.gameboard.isInBounds([cells]) &&
          !this.#isPreviouslyAttacked(cells)
        ) {
          verticalCells.push(cells);
        }
      }
      return verticalCells;
    }
  }

  attackRandomCell() {
    return [
      Math.floor(Math.random() * BOARD_SIZE[0]),
      Math.floor(Math.random() * BOARD_SIZE[1]),
    ];
  }

  queueAttack(attacks, queue) {
    for (let attack of attacks) {
      queue.push(attack);
    }
  }

  dequeueAttack(queue) {
    return queue.shift();
  }

  clearQueues() {
    this.attackQueues.horizontal = [];
    this.attackQueues.vertical = [];
  }

  #isPreviouslyAttacked(coordinates) {
    return this.previouslyAttacked.some((arr) =>
      arr.every((value, index) => value === coordinates[index]),
    );
  }
}
