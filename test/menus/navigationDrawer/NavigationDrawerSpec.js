import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../meta/TestBootstrap.js';

let should = chai.should();

describe('NavigationDrawer', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            NavigationDrawer: './src/menus/navigationDrawer/NavigationDrawer.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.NavigationDrawer();
            should.exist(instance);
        });
    });
});