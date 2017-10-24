/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {DataSource}             from 'arva-js/data/DataSource.js';

import {BaseLogin}              from './BaseLogin.js';
import {Settings}               from '../../defaults/DefaultSettings.js';

/**
 * To get this login provider working, perform the following actions:
 * - install the  cordova plugins add cordova-plugin-facebook4 --save --variable APP_ID="xxx" --variable APP_NAME="xxx"
 * - add the following to the whitelisted domains in index.html's Content-Security-Policy:
 * https://auth.firebase.com http://connect.facebook.net https://connect.facebook.net http://*.ak.facebook.com https://*.ak.facebook.com
 */
@inject(DataSource)
export class FacebookLogin extends BaseLogin {
    
    
    constructor() {
        super();
        if(!window.facebookConnectPlugin){
            console.log("Error - the facebook connect plugin 'cordova-plugin-facebook4' isn't properly installed")
        }
    }

    authenticate() {
        return new Promise((resolve, reject)=> {
            facebookConnectPlugin.login(['public_profile', 'email'], (data) => {
                resolve(data);
            }, (reason) => {
                reject(reason);
            });
        });
    }

    getApiToken() {
        return new Promise((resolve, reject)=> {
            facebookConnectPlugin.getAccessToken((data) => {
                resolve(data);
            }, (reason) => {
                reject(reason);
            });
        });
    }

    async authenticateToDataSource() {
        await this.authenticate();
        try {
            let token = await this.getApiToken();
            if (token) {
                let authData = await this._dataSource.authWithOAuthToken('facebook', token);
                return { uid: authData.uid, profile: authData, provider: 'facebook' };
            } else {
                throw new Error('No token received from Facebook plugin');
            }
        } catch(error) {
            throw new Error(`Failed to login with Facebook: ${error.message || error}`);
        }
    }

    async deauthenticate() {
        return await new Promise((resolve, reject) => facebookConnectPlugin.logout(resolve, reject));
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
        try {
            this.deauthenticate();
        } catch (error) {
            console.log('Error deauthenticating Facebook', error);
        }
    }
    
    async revokePermission(userId) {
        return await new Promise((resolve, reject) => facebookConnectPlugin.api(`/${userId}/permissions?method=delete`, [], resolve, reject));
    }
}
