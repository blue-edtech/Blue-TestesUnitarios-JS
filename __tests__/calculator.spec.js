import { sum, subtract, divide } from '../calculator.js';

describe('calculator sum', () => {
  test('it should sum two positive values', () => {

    const result = sum(2, 2);

    expect(result).toBe(4);

  });
  test('it should sum numbers with a negative value values', () => {

    const result = sum(2, -2);

    expect(result).toBe(0);

  });
});

  describe('calculator subtract', () => {
    test('it should subtract two positive values', () => {

    const result = subtract(2, 2);

    expect(result).toBe(0);

  });
})