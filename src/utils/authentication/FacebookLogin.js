/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {DataSource}             from 'arva-js/data/DataSource.js';

import {BaseLogin}              from './BaseLogin.js';
import {Settings}               from '../../defaults/DefaultSettings.js';

/**
 * To get this login provider working, perform the following actions:
 * - install the cordova plugin --save cordova-plugin-facebook4
 * - export facebookAppId in /arva-js/defaults/defaultSettings.js
 * - add a div with id "fb-root" to index.html
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

        if (!Settings.facebookBrowserModule) {
            throw new Error('You need to both install the Cordova ' +
                'Facebook Plugin, and set facebookBrowserModule to the path to the browser.js of the locally installed ' +
                'facebook plugin in DefaultSettings.js.\n\n' +
                'For example: import facebook from \'../plugins/cordova-plugin-facebook4/www/facebook-browser.js\'; ' +
                'Settings.facebookBrowserModule = facebook;');
        }

        if (!Settings.facebookAppId) {
            throw new Error('You need to specify facebookAppID in DefaultSettings.js');
        }
    }

    async authenticate() {
        /* If we're running in a browser, the plugin needs special initialization */
        if (window.cordova && window.cordova.platformId === 'browser') {
            Settings.facebookBrowserModule.browserInit(Settings.facebookAppID);
        }
        return await new Promise((resolve, reject) =>
            Settings.facebookBrowserModule.login(['public_profile', 'email'], resolve, reject));
    }

    async authenticateToDataSource() {
        await this.authenticate();
        let token = await new Promise((resolve) => Settings.facebookBrowserModule.getAccessToken(resolve));
        if (token) {
            let authData = await this._dataSource.authWithOAuthToken('facebook', token);
            return {uid: authData.uid, profile: authData.facebook, provider: 'facebook'};
        }
    }

    async deauthenticate() {
        return await new Promise((resolve, reject) => Settings.facebookBrowserModule.logout(resolve, reject));
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
        try {
            this.deauthenticate();
        } catch (error) {
            console.log('Error deauthenticating Facebook', error);
        }
    }
}
