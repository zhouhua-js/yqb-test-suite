/* eslint-disable */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';




chai.use(sinonChai);
chai.use(chaiAsPromised);



// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get;
Object.defineProperty(chai.Assertion.prototype, 'not', {
    get() {
        Object.assign(this, this.assignedNot);
        return originalNot.apply(this);
    },
    set(newNot) {
        this.assignedNot = newNot;
        return newNot;
    }
});

// Combine both jest and chai matchers on expect
const jestExpect = global.expect;

global.expect = actual => {
    const originalMatchers = jestExpect(actual);
    const chaiMatchers = chai.expect(actual);
    const { assertionsMade } = jestExpect.getState();
    Object.defineProperty(chaiMatchers, 'to', {
        get() {
            jestExpect.setState({ assertionsMade: assertionsMade + 1 });
            return chai.expect(actual);
        }
    });
    const combinedMatchers = Object.assign(chaiMatchers, originalMatchers);
    return combinedMatchers;
};
Object.keys(jestExpect).forEach(key => (global.expect[key] = jestExpect[key]))

global.assert = assert;



