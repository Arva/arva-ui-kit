/**
 * Created by vlad on 25/07/16.
 */

import chai                         from 'chai';
import {loadDependencies}           from '../meta/TestBootstrap.js';

let should = chai.should();

describe('DefaultColors', () => {
    let imports = {};

    before(() => {

        return loadDependencies({
            Colors: System.normalizeSync('./src/defaults/DefaultColors.js'),
        }).then((importedObjects) => {
            imports = importedObjects;
        });
    });

    describe('#import', () => {
        it('imports without exceptions', () => {
            let instance = imports.Colors;
            should.exist(instance);
        });
    });
});