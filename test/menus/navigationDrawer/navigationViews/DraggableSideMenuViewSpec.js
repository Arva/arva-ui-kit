import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../../../meta/TestBootstrap.js';

let should = chai.should();

describe('DraggableSideMenuView', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            DraggableSideMenuView: './src/menus/navigationDrawer/navigationViews/DraggableSideMenuView.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.DraggableSideMenuView({colors: {}, sideMenuOptions: {}});
            should.exist(instance);
        });
    });
});