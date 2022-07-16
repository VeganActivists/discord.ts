/* SPDX-License-Identifier: MIT
Vegan Activists (VeganActivists@proton.me) */

const sum = (a: number, b: number): number => a + b;

describe('Tests the sum function to make sure Jest for TypeScript is working.', () => {
  it('should add 1 + 2 and find the result to be 3', () =>
    expect(sum(1, 2)).toBe(3));

  it('should add 2 + 2, and find the sum to be greater than 3', () =>
    expect(sum(2, 2)).toBeGreaterThan(3));
});
