/**
 * Created by tom on 29/09/15.
 */

import {inject}                 from 'di';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {GetRequest}             from 'arva-js/utils/request/RequestClient.js';

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

    authenticateToDataSource(email, password) {

        return new Promise(async function (resolve, reject) {
            try {
                this._dataSource.authWithPassword({email: email, password: password}, (error, authData) => {
                    if (!error) {
                        resolve({uid: authData.uid, profile: {email, password}});
                    } else {
                        reject(error);
                    }
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
