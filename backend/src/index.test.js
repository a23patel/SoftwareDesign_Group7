beforeEach(() => {
    console.log('Performing setup');
});

afterEach(() => {
    console.log('Performing teardown');
});

test('testing that 1+1 = 2', () => {
    expect(1+1).toBe(2);
});