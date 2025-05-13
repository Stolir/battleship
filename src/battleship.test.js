import { Ship, BOARD_SIZE, Gameboard, Player } from "./battleship";

describe("Creates Ship object with correct values/methods", () => {
  let testShip;
  beforeEach(() => (testShip = new Ship(2, [3, 4], "vertical")));

  test("New ship has correct length", () => {
    expect(testShip.length).toBe(2);
  });

  test("New ship has correct hit amount", () => {
    expect(testShip.hits).toBe(0);
  });

  describe("New ship has correct location values", () => {
    test("Has correct starting point", () => {
      expect(testShip.location.start).toEqual([3, 4])
    })

    test("Has correct orientation", () => {
      expect(testShip.location.orientation).toBe("vertical")
    })
  })

  test("Handles ship creation when no start or orientation are passed", ()=> {
    expect(new Ship(2).location.start).toBe(null)
    expect(new Ship(2).location.orientation).toBe(null)
  })

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
  });

  describe("Generates board correctly", () => {
    test("Generates 2D array with correct row count", () => {
      expect(testGameboard.board.length).toEqual(BOARD_SIZE[0]);
    });

    test("Generates 2D array with correct column count", () => {
      expect(testGameboard.board[0].length).toEqual(BOARD_SIZE[1]);
    });
  });

  describe("Generates ships correctly", () => {
    test("Generates correct amount of ships", () => {
      expect(Object.keys(testGameboard.ships).length).toBe(5);
    });

    test("Generates a destroyer", () => {
      expect(testGameboard.ships).toHaveProperty("destroyer");
      expect(testGameboard.ships.destroyer).toEqual(new Ship(2));
    });

    test("Generates a submarine", () => {
      expect(testGameboard.ships).toHaveProperty("submarine");
      expect(testGameboard.ships.submarine).toEqual(new Ship(3));
    });

    test("Generates a cruiser", () => {
      expect(testGameboard.ships).toHaveProperty("cruiser");
      expect(testGameboard.ships.cruiser).toEqual(new Ship(3));
    });

    test("Generates a battleship", () => {
      expect(testGameboard.ships).toHaveProperty("battleship");
      expect(testGameboard.ships.battleship).toEqual(new Ship(4));
    });

    test("Generates a carrier", () => {
      expect(testGameboard.ships).toHaveProperty("carrier");
      expect(testGameboard.ships.carrier).toEqual(new Ship(5));
    });
  });

  describe("Handles ship placement correctly", () => {
    test("Handles invalid ship names", () => {
      expect(testGameboard.placeShip([9, 11], "plane", "horizontal")).toMatch(/name/);
    });

    test("Places ship on correct starting cell", () => {
      testGameboard.placeShip([4, 6], "destroyer", "horizontal");
      expect(testGameboard.board[4][7]).toBeInstanceOf(Ship);
    });

    test("Places ship horizontally on board", () => {
      testGameboard.placeShip([0, 0], "destroyer", "horizontal");
      expect(testGameboard.board[0][0]).toBeInstanceOf(Ship);
      expect(testGameboard.board[0][1]).toBeInstanceOf(Ship);
    });

    test("Places ship vertically on board", () => {
      testGameboard.placeShip([0, 0], "destroyer", "vertical");
      expect(testGameboard.board[0][0]).toBeInstanceOf(Ship);
      expect(testGameboard.board[1][0]).toBeInstanceOf(Ship);
    });

    test("Handles out of bounds placements", () => {
      expect(testGameboard.placeShip([9, 11], "destroyer", "horizontal")).toMatch(/bounds/);
    });

    test("Handles already occupied placements", () => {
      testGameboard.placeShip([0, 1], "carrier", "vertical");
      expect(testGameboard.placeShip([1, 0], "submarine", "horizontal")).toMatch(/occupied/);
    });

    test("Records correct ship location in the 'ships' object", ()=> {
      testGameboard.placeShip([0, 1], "carrier", "vertical");
      expect(testGameboard.ships.carrier.location.start).toEqual([0, 1])
      expect(testGameboard.ships.carrier.location.orientation).toBe("vertical")
    })
  });

  describe("Correctly handles attacks", () => {
    beforeEach(() => {
      testGameboard.placeShip([0, 0], "battleship", "vertical");
    });

    test("Handles missed attacks", () => {
      expect(testGameboard.recieveAttack([0, 1])).toBe(testGameboard.board[0][1]);
    });

    test("Handles hit shots", () => {
      expect(testGameboard.recieveAttack([0, 0])).toBe(testGameboard.board[0][0]);
    });

    test("Handles out of bounds attacks", () => {
      expect(testGameboard.recieveAttack([9, 11])).toMatch(/bounds/);
    });

    test("Handles coordinates of type string", () => {
      expect(testGameboard.recieveAttack(["0", "0"])).toBe(testGameboard.board[0][0]);
    })
  });

  describe("Correctly reports whether all ships have sunk or not", () => {
    test("Returns false when not all ships were sunk", () => {
      expect(testGameboard.isLost()).toBe(false);
    });

    test("Returns true when all ships have been sunk", () => {
      for (let ship of Object.keys(testGameboard.ships)) {
        testGameboard.ships[ship].hits = ship.length;
      }
      expect(testGameboard.isLost()).toBe(true);
    });
  });
});

describe("Handles player object creation", () => {
  let testPlayer;
  let testCPU;
  beforeEach(() => {
    testPlayer = new Player("player");
    testCPU = new Player("cpu");
  });

  test("Creates player of type player", () => {
    expect(testPlayer.type).toBe("player");
  });

  test("Creates player of type CPU", () => {
    expect(testCPU.type).toBe("cpu");
  });

  test("Generates a gameboard for players", () => {
    expect(testPlayer).toHaveProperty("gameboard");
  });
});
