const parseArgs = require("./parseArgs");

test('passes', () => {});

test('all args missing', () => {
    const [a, b, c] = parseArgs(1, 2, 3)();
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(c).toBe(3);
})

test('one arg missing', () => {
    const [a, b, c] = parseArgs(1, 2, 3)(1, 2);
    expect(a).toBe(1);
    expect(b).toBe(1);
    expect(c).toBe(2);
})
