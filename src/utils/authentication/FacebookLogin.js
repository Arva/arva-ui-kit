/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'di';
import {DataSource}             from 'arva-js/data/DataSource.js';
import facebookBrowserModule    from '../../../plugins/cordova-plugin-facebook4/www/facebook-browser.js';

import {BaseLogin}              from './BaseLogin';
import {FacebookAppID}          from '../../settings';

/**
 * To get this login provider working, perform the following actions:
 * - install the cordova plugin com.phonegap.plugins.facebookconnect
 * - export FacebookAppID in /src/settings.js
 * - copy dummy /src/cordova.js and /src/exec.js files
 * - add a div with id "fb-root" to index.html
 * - add this to config.js' paths field: "plugins/*": "plugins/*.js"
 * - add this to config.js' maps field: "cordova": ""
 * - add the following to the whitelisted domains in index.html's Content-Security-Policy:
 *   https://auth.firebase.com http://connect.facebook.net https://connect.facebook.net http://*.ak.facebook.com https://*.ak.facebook.com
 */
@inject(DataSource)
export class FacebookLogin extends BaseLogin {

    /**
     *
     * @param {DataSource} dataSource
     */
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;

        if(!window.facebookConnectPlugin) { window.facebookConnectPlugin = facebookBrowserModule; }
    }

    setFacebookAppID(id = null){
        this.facebookAppID = id;
    }

    authenticate() {

        return new Promise((resolve, reject) => {
            if (!this.facebookAppID) {
                reject(new Error('No Facebook app ID is set, please set one using setFacebookAppID'));
            }

            /* If we're running in a browser, the plugin needs special initialization */
            if (window.cordova && window.cordova.platformId === 'browser') {
                facebookConnectPlugin.browserInit(this.facebookAppID);
            }

            facebookConnectPlugin.login(['public_profile', 'email'], resolve, reject);
        });
    }

    authenticateToDataSource() {

        return new Promise(async function (resolve, reject) {
            try {
                let data = await this.authenticate();
                facebookConnectPlugin.getAccessToken((token) => {
                    if (token) {
                        this._dataSource.authWithOAuthToken('facebook', token, (error, authData) => {
                            if (!error) {
                                resolve({uid: authData.uid, profile: authData.facebook, provider: 'facebook'});
                            } else {
                                reject(error);
                            }
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        }.bind(this));

    }

    deauthenticate() {
        return new Promise((resolve, reject) => {
            facebookConnectPlugin.logout(resolve, reject);
        });
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
        try {
            this.deauthenticate();
        } catch (error) { console.log('Error deauthenticating Facebook', error); }
    }
}
