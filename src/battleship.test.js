import { Ship } from "./battleship";

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
