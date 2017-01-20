/**
 * Created by tom on 25/05/15.
 */

import {Router}             from 'arva-js/core/Router';
import {DataSource}         from 'arva-js/data/DataSource';
import {ArvaRouter}         from 'arva-js/routers/ArvaRouter';
import {Injection}          from 'arva-js/utils/Injection.js';
import {provide, inject}    from 'arva-js/utils/di/Decorators.js';

@provide(Router)
@inject(DataSource)
export class LoginAwareRouter extends ArvaRouter {
    constructor(dataSource) {
        super(arguments);
        this._dataSource = dataSource;

        this.isReady = this._initialize();
    }

    setUser(user) {
        let preExists = !!this._user;
        this._user = user;
        this.emit(preExists ? 'loginchange' : 'login');
    }

    getUser() {
        return this._user;
    }

    async _executeRoute(rule, route) {
        await this.isReady;

        if (route.controller === 'Login' || this._user) {
            super._executeRoute(rule, route);
        } else {
            this.go('Login', 'Index');
        }
    }
    
    async _initialize() {
        /* TODO: add timeout to early exit when user launches app without network */
        let dataSource = Injection.get(DataSource);
        this.setUser(await dataSource.getAuth());
    }
}