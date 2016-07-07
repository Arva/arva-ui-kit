/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'di';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {GetRequest}             from 'arva-js/utils/request/RequestClient';

@inject(DataSource)
export class MoodleLogin extends BaseLogin {
    get organisationID() {
        return this._organisationID;
    }

    set organisationID(value) {
        this._organisationID = value;
    }

    get requestURI() {
        return this._requestURI;
    }

    set requestURI(value) {
        this._requerstURI = value;
    }

    /**
     *
     * @param {DataSource} dataSource
     */
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;
    }


    authenticate(username, password) {
        let uri = this.requestURI || '';
        uri += `&username=${username}`;
        uri += `&password=${password}`;
        uri += `&provider=moodle`;
        uri += `&organisation=${this.organisationID}`;

        return new Promise((resolve, reject) => {
            if (!this.organisationID || this.requestURI) reject("Please set the organisationID or requestURI");
            GetRequest(uri)
                .then(function (response) {
                    let data = JSON.parse(response);
                    if (data.token) {
                        resolve(data)
                    } else {
                        reject('The username or password you entered was incorrect')
                    }
                }, function (error) {
                    reject(error);
                });
        });
    }

    authenticateToDataSource(username, password) {
        return new Promise(async function (resolve, reject) {
            try {
                let data = await this.authenticate(username, password);
                if (data && data.token) {
                    this._dataSource.authWithCustomToken(data.token, (error, authData) => {
                        if (!error) {
                            resolve({uid: authData.uid, profile: data});
                        } else {
                            reject(error);
                        }
                    });
                }
            } catch (error) {
                reject(error)
            }
        }.bind(this));

    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
