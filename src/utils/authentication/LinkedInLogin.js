/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {DataSource}             from 'arva-js/data/DataSource.js';
import {BaseLogin}              from './BaseLogin.js';

import {Settings}               from '../../defaults/DefaultSettings.js';

/**
 * To get this login provider working, perform the following action:
 * - install the cordova plugin cordova-plugin-inappbrowser
 */
@inject(DataSource)
export class LinkedInLogin extends BaseLogin {
    
    constructor(dataSource) {
        super();
        if(!Settings.linkedInAuthServerUrl || !Settings.linkedInClientID) {
            throw new Error('You need to specify linkedInAuthServerUrl and linkedInClientID in DefaultSettings.js');
        }
    }

    async authenticate() {
        let onLinkedInLogin = new Promise();

        /* We can't easily do InAppBrowser opens in a browser, so we'll not support LinkedIn in browser yet. */
        if (window.cordova.platformId === 'browser') {
            throw new Error('LinkedIn login not yet supported in browser environments');
        }

        let oAuthUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${SettingslinkedInClientID}&redirect_uri=${encodeURIComponent(Settings.linkedInAuthServerUrl)}&scope=r_emailaddress&state=X3JY67wvGRpEKKiYC`;
        let linkedInWindow = cordova.InAppBrowser.open(oAuthUrl, '_blank', 'location=yes,closebuttoncaption=Cancel');

        linkedInWindow.addEventListener('loadstop', function () {

            /* Hide LinkedIn cancel button since we have our own,
             * and turn the username into an email field since LinkedIn doesn't do this themselves */
            linkedInWindow.executeScript({code: 'if($){$(".cancel").hide(); $("input[name=session_key]").prop("type", "email")}'}, function () {
            });

            /* Grab login data if currently loaded page is our login server */
            linkedInWindow.executeScript({code: 'window.loginData'}, (data) => {
                /* InAppBrowser returns data as array, but we only need one entry */
                data = data[0];

                if (!data) {
                    return;
                }
                if (data.error) {
                    throw new Error(error);
                }

                onLinkedInLogin.resolve(data);
                linkedInWindow.close();
            });
        }.bind(this));

        /* Returns login data */
        return await onLinkedInLogin;
    }

    async authenticateToDataSource() {
        let data = await this.authenticate();
        if (data && data.firebaseToken) {
            let authData = await this._dataSource.authWithCustomToken(data.firebaseToken);
            return {uid: authData.uid, profile: data};
        }
    }

    deauthenticate() {
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
