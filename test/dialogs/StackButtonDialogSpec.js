import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../meta/TestBootstrap.js';

let should = chai.should();

describe('StackButtonDialog', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            StackButtonDialog: './src/dialogs/StackButtonDialog.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.StackButtonDialog({buttons: {entries: () => {return []}}});
            should.exist(instance);
        });
    });
});