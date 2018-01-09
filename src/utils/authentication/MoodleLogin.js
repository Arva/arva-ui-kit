/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {GetRequest}             from 'arva-js/utils/request/RequestClient';

import {Settings}               from '../../defaults/DefaultSettings.js';

@inject(DataSource)
export class MoodleLogin extends BaseLogin {

    constructor(dataSource) {
        super();
        if(!Settings.moodleOrganisationID) { throw new Error('You need to specify moodleOrganisationID in DefatultSettings.js'); }
        if(!Settings.moodleRequestURI) { throw new Error('You need to specify moodleRequestURI in DefatultSettings.js'); }
    }

    async authenticate(username, password) {
        let uri = `${Settings.moodleRequestURI}&username=${username}&password=${password}` +
                  `&provider=moodle&organisation=${Settings.moodleOrganisationID}`;

        let data = await JSON.parse(GetRequest(uri));
        if (data.token) {
            return data;
        } else {
            throw new Error('The username or password you entered was incorrect');
        }
    }

    async authenticateToDataSource(username, password) {
        let data = await this.authenticate(username, password);
        if (data && data.token) {
            let authData = await this._dataSource.authWithCustomToken(data.token);
            return {uid: authData.uid, profile: data};
        }
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
