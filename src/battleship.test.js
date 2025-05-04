import { Ship, BOARD_SIZE, Gameboard, } from "./battleship";

describe("Creates Ship object with correct values/methods", () => {
  let testShip;
  beforeEach(() => (testShip = new Ship(2)));

  test("New ship has correct length", () => {
    expect(testShip.length).toBe(2);
  });

  test("New ship has correct hit amount", () => {
    expect(testShip.hits).toBe(0);
  });

  test("Returns false when not sunk", () => {
    expect(testShip.isSunk()).toBe(false);
  });

  test("Returns correctly updates hits", () => {
    testShip.hit();
    expect(testShip.hits).toBe(1);
  });

  test("Returns true when sunk", () => {
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
  });
});

describe("Creates Gameboard object with correct values/methods", () => {
  let testGameboard;
  let testShip; 
  beforeEach(() => {
    testGameboard = new Gameboard();
    testShip = new Ship(2);
  })

  test("Generates 2D array with correct row count", () => {
    expect(testGameboard.board.length).toEqual(BOARD_SIZE[0])
  })

  test("Generates 2D array with correct column count", () => {
    expect(testGameboard.board[0].length).toEqual(BOARD_SIZE[1])
  })

  test("Places ship on correct starting cell", () => {
    testGameboard.placeShip([4,7], testShip, "horizontal"); 
    expect(testGameboard.board[4][7]).toBe(testShip)
  })

  test("Places ship horizontally on board", () => {
    testGameboard.placeShip([0,0], testShip, "horizontal"); 
    expect(testGameboard.board[0][0]).toBe(testShip)
    expect(testGameboard.board[0][1]).toBe(testShip)
  })

  test("Places ship vertically on board", () => {
    testGameboard.placeShip([0,0], testShip, "vertical"); 
    expect(testGameboard.board[0][0]).toBe(testShip)
    expect(testGameboard.board[1][0]).toBe(testShip)
  })
})