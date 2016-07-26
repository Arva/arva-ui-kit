import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../../meta/TestBootstrap.js';

let should = chai.should();

describe('MenuItem', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            MenuItem: './src/menus/navigationDrawer/navigationViews/MenuItem.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.MenuItem({colors: {}, sideMenuOptions: {}});
            should.exist(instance);
        });
    });
});