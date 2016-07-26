import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../../meta/TestBootstrap.js';

let should = chai.should();

describe('DraggableSideMenu', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            DraggableSideMenu: './src/menus/navigationDrawer/navigationViews/DraggableSideMenu.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.DraggableSideMenu();
            should.exist(instance);
        });
    });
});