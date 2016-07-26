/**
 * Created by vlad on 22/07/16.
 */

import chai                         from 'chai';
import {loadDependencies}           from '../meta/TestBootstrap.js';

let should = chai.should();

describe('DefaultTypefaces', () => {
    let imports = {};

    before(() => {

        return loadDependencies({
            TypeFaces: System.normalizeSync('./src/defaults/DefaultTypefaces.js'),
        }).then((importedObjects) => {
            imports = importedObjects;
        });
    });

    describe('#import', () => {
        it('imports without exceptions', () => {
            let instance = imports.TypeFaces;
            should.exist(instance);
        });
    });
});