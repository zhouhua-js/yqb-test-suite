import sinon from 'sinon';
import axios from 'axios';
import { longDelay } from './someFunction';

describe('Sinon.spy()', () => {
    // Apis Referrence: http://sinonjs.org/releases/v5.0.7/spies/
    it('spies a existing function', () => {
        function random() {
            return Math.ceil(Math.random() * 6);
        }
        const spy = sinon.spy(random);
        const num = spy();
        expect(num).to.within(1, 6);
        expect(spy.calledOnce).to.be.ok;
        // or using sinon-chai api
        expect(spy).to.have.been.calledOnce;
    });
    it('spies properties of given object', () => {
        var object = { method() { } };
        var spy = sinon.spy(object, "method");
        object.method(42);
        object.method(1);
        assert(spy.withArgs(42).calledOnce);
        assert(spy.withArgs(1).calledOnce);
        spy.restore();
    });
    it('spies an anonymous function', async () => {
        const spy = sinon.spy();
        await new Promise((resolve, reject) => {
            resolve(true);
            reject(false);
        })
            .then(spy)
            .catch(spy);
        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith(true);
    });
});

describe('sinon.stub()', () => {
    // Apis Referrence: http://sinonjs.org/releases/v5.0.7/stubs/
    it('makes a fake function', () => {
        const fake = sinon.stub().returns(42);
        expect(fake()).to.equal(42);
    });
    it('makes a fake function of a given object', () => {
        const fakeRandom = sinon.stub(Math, 'random');
        fakeRandom.callsFake(() => 6);
        expect(Math.random()).to.equal(6);
        fakeRandom.restore();
    });

    it('fakes properties of a given object', () => {
        const myObj = {
            example: 'oldValue',
            prop: 'foo'
        };
        const stub = sinon.stub(myObj, 'example').value('newValue');
        expect(myObj.example).to.equal('newValue');
        stub.restore();

        const anotherStub = sinon.stub(myObj, 'prop').set(value => {
            myObj.example = value;
        });
        myObj.prop = 'bar';
        expect(myObj.example).to.equal('bar');
        anotherStub.restore();
    });
});

describe('timer', () => {
    // Apis Referrence: http://sinonjs.org/releases/v5.0.7/fake-timers/
    let clock;
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });
    afterEach(() => {
        clock.restore();
    });
    it('fakes timers', done => {
        longDelay(done);
        clock.tick(100000);
    });
});

describe('fake XHR and server', () => {
    // Apis Referrence: http://sinonjs.org/releases/v5.0.7/fake-xhr-and-server/
    it('fakes XHR', async () => {
        const server = sinon.useFakeXMLHttpRequest();
        const fakeResponse = {
            name: 'Mike',
            age: 20
        };
        server.onCreate = request => {
            setTimeout(() => {
                expect(request.url).to.equal('/some/path');
                request.respond(
                    200,
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(fakeResponse)
                )
            }, 1);
        }
        await axios.get('/some/path')
            .then(res => {
                expect(res.data).to.deep.equal(fakeResponse);
            });
        server.restore();
    });

    it('fakes a server', async () => {
        const persons = [{
            id: '1',
            name: 'Mike',
            age: 20
        },
        {
            id: '2',
            name: 'Jack',
            age: 35
        },
        {
            id: '3',
            name: 'Alice',
            age: 12
        }];

        const server = sinon.createFakeServer({
            autoRespond: true,
            autoRespondAfter: 1
        });
        server.respondWith('/persons', [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify(persons)
        ])
        server.respondWith('/person/:id', (xhr, id) => {
            const person = persons.find(p => p.id === id);
            if (person) {
                xhr.respond(200,
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(person));
            }
            else {
                xhr.respond(404,
                    { 'Content-Type': 'text/plain' },
                    'nobody');
            }
        });
        await axios.get('/wrong/path')
            .catch(({ response }) => {
                expect(response.status).to.equal(404);
            });
        await axios.get('/persons')
            .then(({ data }) => {
                expect(data).to.deep.equal(persons);
            });
        await axios.get('/person/1')
            .then(({ data }) => {
                expect(data.name).to.equal('Mike');
            });
        await axios.get('/person/100')
            .catch(({ response }) => {
                expect(response.status).to.equal(404);
            });
        server.restore();
    });
});
