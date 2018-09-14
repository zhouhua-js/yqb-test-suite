import { sum, delay } from './someFunction';

describe('Assertions', () => {
    it('shows usages of `assert`', () => {
        // Apis Referrence: https://nodejs.org/api/assert.html
        // power assert: https://github.com/power-assert-js/power-assert#api
        assert.equal(sum(1, 1), 2);
    });
    it('shows usages of `expect` (jest style)', () => {
        // Apis Referrence: https://facebook.github.io/jest/docs/en/expect.html
        expect(sum(1, 1) === 2);
        expect(sum(1, 1)).toBe(2);
        expect(sum(1, 1)).not.toBe(1);
        expect(sum(0,1) === 1);
        expect(sum(1,0) === 1);
    });
    it('shows usages of `expect` (chai style)', () => {
        // Apis Referrence: http://www.chaijs.com/api/bdd/
        expect(sum(1, 1)).to.equal(2);
        expect(sum(1, 1)).is.not.equal(1);
    });
});

describe('Testing Asynchronous Code', () => {
    // https://facebook.github.io/jest/docs/en/asynchronous.html
    describe('returns a promise', () => {
        it('resolves later', () => {
            return delay(true).then(msg => {
                expect(msg).toBe('done');
            });
        });
        it('rejects later', () => {
            expect.assertions(1);
            return delay(false).catch(err => {
                expect(err).toBeInstanceOf(Error);
            });
        });
    });
    describe('callback style', () => {
        it('resolves later', done => {
            delay(true).then(msg => {
                expect(msg).toBe('done');
                done();
            });
        });
        it('rejects later', done => {
            delay(false).catch(err => {
                expect(err).toBeInstanceOf(Error);
                done();
            });
        });
    });
    describe('aysnc/await style', () => {
        it('resolves later', async () => {
            const msg = await delay(true);
            expect(msg).toBe('done');
            // or expect.resolves (Jest)
            await expect(delay(true)).resolves.toBe('done');
            // or chai-as-promiesd (https://github.com/domenic/chai-as-promised)
            await expect(delay(true)).to.eventually.equal('done');
        });
        it('rejects later', async () => {
            try {
                await delay(false);
            } catch (e) {
                expect(e).is.a('Error');
            }
            // or expect.rejects (Jest)
            await expect(delay(false)).rejects.toBeInstanceOf(Error);
            // or chai-as-promiesd (https://github.com/domenic/chai-as-promised)
            await expect(delay(false)).to.be.rejectedWith('fail');
        });
    });
})
