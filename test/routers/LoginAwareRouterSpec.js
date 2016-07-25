import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../meta/TestBootstrap.js';

let should = chai.should();

describe('LoginAwareRouter', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            LoginAwareRouter: './src/routers/LoginAwareRouter.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.LoginAwareRouter();
            should.exist(instance);
        });
    });
});