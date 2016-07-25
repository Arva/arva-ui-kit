import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../meta/TestBootstrap.js';

let should = chai.should();

describe('BaseLogin', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            BaseLogin: './src/utils/authentication/BaseLogin.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.BaseLogin();
            should.exist(instance);
        });
    });
});