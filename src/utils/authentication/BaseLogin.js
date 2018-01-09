/**
 * Created by tom on 26/05/15.
 */
import {Injection}                  from 'arva-js/utils/Injection.js';
import {DataSource}                 from 'arva-js/data/DataSource.js';
    
export class BaseLogin {

    
    constructor(dataSource){
        this._dataSource = Injection.get(DataSource);
    }
    
    authenticate(credentials) { }

    async authenticateToDataSource() {  }

    deauthenticate() { }

    deauthenticateFromDataSource() { }
}