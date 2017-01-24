/**
 * Created by tom on 29/09/15.
 */

import {inject}                 from 'arva-js/utils/di/Decorators.js';
import {BaseLogin}              from './BaseLogin';
import {DataSource}             from 'arva-js/data/DataSource.js';

@inject(DataSource)
export class PasswordLogin extends BaseLogin {
    constructor() {
        super();
    }

    async authenticateToDataSource(email, password) {
        let authData = await this._dataSource.authWithPassword({email: email, password: password});
        return {uid: authData.uid, profile: {email}};
    }

    deauthenticateFromDataSource() {
        this._dataSource.unauth();
    }

    /**
     * Currently only implemented for Firebase DataSource
     */
    async changePassword(oldPassword, newPassword){
        let user = await this._dataSource.getAuth();
        let oldCredential = this._dataSource._firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
        try {
            await user.reauthenticate(oldCredential);
            user.updatePassword(newPassword).then(function () {
                /* Done saving password, go back to Profile/Index */
                return true;
            }, function (error) {
                /* Show dialog with error here */
               throw new Error(error);
            });
        } catch (error) {
            /* Show dialog with error here */
            throw new Error(error);
        }
    }
}
