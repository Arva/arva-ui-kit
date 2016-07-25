import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../../meta/TestBootstrap.js';

let should = chai.should();

describe('TopMenu', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            TopMenu: './src/menus/navigationDrawer/navigationViews/TopMenu.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.TopMenu();
            should.exist(instance);
        });
    });
});