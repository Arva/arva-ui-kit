/**
 * Created by tom on 29/09/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';

@inject(DataSource)
export class PasswordLogin extends BaseLogin {
    /**
     *
     * @param {DataSource} dataSource
     */
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;
    }

    async authenticateToDataSource(email, password) {
        let authData = await this._dataSource.authWithPassword({email: email, password: password});
        return {uid: authData.uid, profile: {email, password}};
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
