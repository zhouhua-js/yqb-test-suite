import { sum } from './someFunction';

describe('test style (BDD) and assertions', () => {
    it('shows usages of `assert`', () => {
        // Apis Referrence: https://nodejs.org/api/assert.html
        assert.equal(sum(1, 1), 2);
    });
    it('shows usages of `expect` (jest style)', () => {
        // Apis Referrence: https://facebook.github.io/jest/docs/en/expect.html
        expect(sum(1, 1) === 2);
        expect(sum(1, 1)).toBe(2);
        expect(sum(1, 1)).not.toBe(1);
    });
    it('shows usages of `expect` (chai style)', () => {
        // Apis Referrence: https://facebook.github.io/jest/docs/en/expect.html
        expect(sum(1, 1)).to.be(2);
        expect(sum(1, 1)).not.to.be(1);
    });
});
