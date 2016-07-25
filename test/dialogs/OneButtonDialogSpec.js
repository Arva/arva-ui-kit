/**
 * Created by vlad on 25/07/16.
 */

import chai                                 from 'chai';
import {
    loadDependencies,
    mockArvaViewDependencies,
    restoreDOMGlobals}                      from '../meta/TestBootstrap.js';

let should = chai.should();

describe('OneButtonDialog', () => {
    let imports = {};

    before(async function() {
        await mockArvaViewDependencies();
        imports = await loadDependencies({
            OneButtonDialog: './src/dialogs/OneButtonDialog.js',
        });
    });

    after(() => {
        restoreDOMGlobals();
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = new imports.OneButtonDialog({button: {}});
            should.exist(instance);
        });
    });
});