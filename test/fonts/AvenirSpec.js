/**
 * Created by vlad on 25/07/16.
 */

import chai                         from 'chai';
import {loadDependencies}           from '../meta/TestBootstrap.js';

let should = chai.should();

describe('Avenir', () => {
    let imports = {};

    before(() => {

        return loadDependencies({
            Avenir: System.normalizeSync('./src/fonts/Avenir.js'),
        }).then((importedObjects) => {
            imports = importedObjects;
        });
    });

    describe('#constructor', () => {
        it('constructs without exceptions', () => {
            let instance = imports.Avenir;
            should.exist(instance);
        });
    });
});