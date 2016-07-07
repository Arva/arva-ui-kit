/**
 * Created by tom on 26/05/15.
 */

import {inject}                 from 'di';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';
import sprintf                  from 'underscore.string/sprintf';

/**
 * To get this login provider working, perform the following action:
 * - install the cordova plugin cordova-plugin-inappbrowser
 */
@inject(DataSource)
export class LinkedInLogin extends BaseLogin {

    set linkedInSettings(value){this._linkedInSettings = value;}
    get linkedInSettings(){return this._linkedInSettings;}

    /**
     *
     * @param {DataSource} dataSource
     */
    constructor(dataSource) {
        super();
        this._dataSource = dataSource;
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            if(!this.linkedInSettings || this.linkedInSettings.authServerCallbackUrl || this.linkedInSettings.clientID){
                reject(new Error('LinkedIn settings object missing, please configure them'))
            }

            /* We can't easily do InAppBrowser opens in a browser, so we'll not support LinkedIn in browser yet. */
            if (window.cordova.platformId === 'browser') {
                reject(new Error('LinkedIn login not yet supported in browser environments'));
            }

            let oAuthUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${this.linkedInSettings.clientID}&redirect_uri=${encodeURIComponent(this.linkedInSettings.authServerCallbackUrl)}&scope=r_emailaddress&state=X3JY67wvGRpEKKiYC`;
            let linkedInWindow = cordova.InAppBrowser.open(oAuthUrl, '_blank', 'location=yes,closebuttoncaption=Cancel');

            linkedInWindow.addEventListener('loadstop', function () {

                /* Hide LinkedIn cancel button since we have our own,
                 * and turn the username into an email field since LinkedIn doesn't do this themselves */
                linkedInWindow.executeScript({code: 'if($){$(".cancel").hide(); $("input[name=session_key]").prop("type", "email")}'}, function () {});

                /* Grab login data if currently loaded page is our login server */
                linkedInWindow.executeScript({code: 'window.loginData'}, (data) => {
                    /* InAppBrowser returns data as array, but we only need one entry */
                    data = data[0];

                    if (!data) { return; }
                    if (data.error) { reject(new Error(error)); }

                    /* TODO: choose correct scope for saving data */
                    localStorage.firebaseToken = data.firebaseToken;

                    resolve(data);
                    linkedInWindow.close();
                });
            }.bind(this));

            linkedInWindow.addEventListener('exit', function () {
                //$('#app_loader').hide();
            });

        });
    }

    authenticateToDataSource() {

        return new Promise(async function (resolve, reject) {
            try {
                let data = await this.authenticate();
                if (data && data.firebaseToken) {
                    this._dataSource.authWithCustomToken(data.firebaseToken, (error, authData) => {
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

    deauthenticate() {
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }
}
