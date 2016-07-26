/**
 * Created by vlad on 25/07/16.
 */

import chai                         from 'chai';
import {loadDependencies}           from '../meta/TestBootstrap.js';

let should = chai.should();

describe('DefaultDimensions', () => {
    let imports = {};

    before(() => {

        return loadDependencies({
            Dimensions: System.normalizeSync('./src/defaults/DefaultDimensions.js'),
        }).then((importedObjects) => {
            imports = importedObjects;
        });
    });

    describe('#import', () => {
        it('imports without exceptions', () => {
            let instance = imports.Dimensions;
            should.exist(instance);
        });
    });
});