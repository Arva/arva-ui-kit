/**
 * Created by tom on 30/09/15.
 */

import {inject}                 from 'di';
import {BaseLogin}              from './BaseLogin';
import {LinkedIn}               from '../../settings';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {GetRequest}             from 'arva-js/utils/request/RequestClient';

@inject(DataSource)
export class AnonymousLogin extends BaseLogin {
    /**
     *
     * @param {DataSource} dataSource
     */
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;
    }

    authenticateToDataSource(options) {
        return new Promise(async function (resolve, reject) {

            try {
                this._dataSource.authAnonymously(options).then((authData) => {
                        resolve({uid: `${authData.uid}`, profile: {}, provider: 'anonymous'});
                    }).catch((error)  => {
                        reject(error);
                    });
            } catch (error) {
                reject(error)
            }
        }.bind(this));

    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
