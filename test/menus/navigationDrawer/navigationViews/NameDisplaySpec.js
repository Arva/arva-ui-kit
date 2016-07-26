import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../../meta/TestBootstrap.js';

let should = chai.should();

describe('NameDisplay', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            NameDisplay: './src/menus/navigationDrawer/navigationViews/NameDisplay.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.NameDisplay();
            should.exist(instance);
        });
    });
});