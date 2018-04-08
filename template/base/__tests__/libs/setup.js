import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import assert from 'assert';
{{#react}}import chaiEnzyme from 'chai-enzyme';
import { shallow, mount, render } from 'enzyme';{{/react}}
{{#rn}}import chaiEnzyme from 'chai-enzyme';
import { shallow, mount, render } from 'enzyme';
import 'react-native-mock/mock';{{/rn}}
{{#vue}}import { shallow, mount, renderToString } from '@vue/test-utils';{{/vue}}

chai.use(sinonChai);
chai.use(chaiAsPromised);
{{#react}}chai.use(chaiEnzyme());{{/react}}
{{#rn}}chai.use(chaiEnzyme());{{/rn}}

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
{{#react}}global.shallow = shallow;
global.mount = mount;
global.render = render;{{/react}}
{{#rn}}global.shallow = shallow;
global.mount = mount;
global.render = render;{{/rn}}
{{#vue}}global.shallow = shallow;
global.mount = mount;
global.renderToString = renderToString;{{/vue}}
