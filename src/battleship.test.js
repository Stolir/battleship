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

describe.only("Creates Gameboard object with correct values/methods", () => {
  let testGameboard;
  beforeEach(() => {testGameboard = new Gameboard()})

  test("Generates 2D array with correct row count", () => {
    expect(testGameboard.board.length).toEqual(BOARD_SIZE[0])
  })

  test("Generates 2D array with correct column count", () => {
    expect(testGameboard.board[0].length).toEqual(BOARD_SIZE[1])
  })
})