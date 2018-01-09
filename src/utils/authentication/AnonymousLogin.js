/**
 * Created by tom on 30/09/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';

@inject(DataSource)
export class AnonymousLogin extends BaseLogin {

    async authenticateToDataSource(options) {
        let authData = await this._dataSource.authAnonymously(options);
        return {uid: `${authData.uid}`, profile: {}, provider: 'anonymous'};
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
