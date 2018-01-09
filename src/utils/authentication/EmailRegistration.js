/**
 * Created by lundfall on 05/01/2017.
 */

import {Injection}              from 'arva-js/utils/Injection.js';
import {DataSource}             from 'arva-js/data/DataSource.js';

export class EmailRegistration {
    constructor(instance  =  Injection.get(DataSource)) {
        this._dataSource = instance;
    }

    register(email, password) {
        return this._dataSource.registerWithPassword({email, password});
    }
}
