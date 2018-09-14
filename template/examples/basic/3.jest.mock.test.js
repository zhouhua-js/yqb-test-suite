// import user from './models/user';
// jest.mock('./models/user');  // hoisted automatically

describe('Mock Functions', () => {
    // Apis Referrence: https://facebook.github.io/jest/docs/en/mock-functions.html
    it('mocks a function', () => {
        const fakeFunction = jest.fn();
        fakeFunction('good');
        expect(fakeFunction.mock.calls.length).to.equal(1);
        expect(fakeFunction).toHaveBeenCalledTimes(1);
        expect(fakeFunction.mock.calls[0][0]).to.equal('good');
    });
    it('mocks Implementations or return values', () => {
        const fakeFunction = jest.fn(() => 42);
        expect(fakeFunction()).to.equal(42);
        expect(fakeFunction.mock.calls.length).to.equal(1);

        const myMock = jest.fn();
        myMock
            .mockReturnValueOnce(10)
            .mockReturnValueOnce('x')
            .mockReturnValue(true);
        expect([myMock(), myMock(), myMock(), myMock()]).to.deep.equal([10, 'x', true, true]);
    });
});

describe('Timer Mocks', () => {
    // Apis Referrence: https://facebook.github.io/jest/docs/en/timer-mocks.html
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('uses fake timers', () => {
        const mock = jest.fn();
        setTimeout(mock, 10);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(mock).toHaveBeenCalledTimes(1);
    });
    it('Advance Timers by Time', () => {
        const fastCallBack = jest.fn();
        const slowCallBack = jest.fn();
        setTimeout(fastCallBack, 100);
        setTimeout(slowCallBack, 500);
        jest.advanceTimersByTime(100);
        expect(fastCallBack).toBeCalled();
        expect(slowCallBack).not.toBeCalled();
    });
});

describe('Manual Mocks', () => {
    // Apis Referrence: https://facebook.github.io/jest/docs/en/manual-mocks.html
    it('mocks local modules', () => {
        jest.doMock('./models/user');
        const user = require('./models/user').default;
        expect(user.getInfo()).toEqual({
            name: 'Jack',
            age: 35
        });
    });
    it('reset', () => {
        jest.dontMock('./models/user');
        const user = require('./models/user').default;
        expect(user.getInfo()).toEqual({
            name: 'Mike',
            age: 20
        });
    });
});
