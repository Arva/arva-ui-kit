/**
 * Created by tom on 25/05/15.
 */

import {Router}             from 'arva-js/core/Router';
import {ArvaRouter}         from 'arva-js/routers/ArvaRouter';
import {DataSource}         from 'arva-js/data/DataSource';
import {provide, inject}    from 'arva-js/utils/di/Decorators.js';

@provide(Router)
@inject(DataSource)
export class LoginAwareRouter extends ArvaRouter {
    constructor(dataSource) {
        super(arguments);
        this._dataSource = dataSource;
    }


    _executeRoute(rule, route) {
        this._dataSource.getAuth().then((user) => {
            if (route.controller === 'Login' || user) {
                super._executeRoute(rule, route);
            } else {
                this.go('Login', 'Register');
            }
        });
    }
}