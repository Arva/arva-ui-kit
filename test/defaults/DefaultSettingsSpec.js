/**
 * Created by vlad on 25/07/16.
 */

import chai                         from 'chai';
import {loadDependencies}           from '../meta/TestBootstrap.js';

let should = chai.should();

describe('DefaultSettings', () => {
    let imports = {};

    before(() => {

        return loadDependencies({
            Settings: System.normalizeSync('./src/defaults/DefaultSettings.js'),
        }).then((importedObjects) => {
            imports = importedObjects;
        });
    });

    describe('#import', () => {
        it('imports without exceptions', () => {
            let instance = imports.Settings;
            should.exist(instance);
        });
    });
});