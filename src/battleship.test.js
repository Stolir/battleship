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

  test("Correctly updates hits", () => {
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
  beforeEach(() => {
    testGameboard = new Gameboard();
  })

  describe("Generates board correctly", () => {
    test("Generates 2D array with correct row count", () => {
      expect(testGameboard.board.length).toEqual(BOARD_SIZE[0])
    })
  
    test("Generates 2D array with correct column count", () => {
      expect(testGameboard.board[0].length).toEqual(BOARD_SIZE[1])
    })
  })

  describe("Places ships correctly", () => {
    test("Places ship on correct starting cell", () => {
      testGameboard.placeShip([4,7], 4, "horizontal"); 
      expect(testGameboard.board[4][7]).toBeInstanceOf(Ship)
    })
  
    test("Places ship horizontally on board", () => {
      testGameboard.placeShip([0,0], 2, "horizontal"); 
      expect(testGameboard.board[0][0]).toBeInstanceOf(Ship)
      expect(testGameboard.board[0][1]).toBeInstanceOf(Ship)
    })
  
    test("Places ship vertically on board", () => {
      testGameboard.placeShip([0,0], 2, "vertical"); 
      expect(testGameboard.board[0][0]).toBeInstanceOf(Ship)
      expect(testGameboard.board[1][0]).toBeInstanceOf(Ship)
    })
  })
})