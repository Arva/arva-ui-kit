/**
 * Created by tom on 25/05/15.
 */

import find                 from 'lodash/find.js';

import {Router}             from 'arva-js/core/Router.js';
import {DataSource}         from 'arva-js/data/DataSource.js';
import {ArvaRouter}         from 'arva-js/routers/ArvaRouter.js';
import {Injection}          from 'arva-js/utils/Injection.js';
import {provide, inject}    from 'arva-js/utils/di/Decorators.js';

/**
 * TODO we should have context-awareness for when we decide to visit a route, i.e. we should be able to have
 *      some insight into the view or controller in the shouldSkip function. The issue is that the current
 *      implementation may not be able get this insight, since it is required to add the routes before the
 *      router is called to vist a route.
 * */
@provide(Router)
@inject(DataSource)
export class LoginAwareRouter extends ArvaRouter {
    constructor(dataSource) {
        super(arguments);
        this._allowedRoutes = ['Login', 'Onboarding'];
        this._routes = [
            {
                controller:'Login',
                controllerMethod:'Index',
                shouldSkip:() => this._user
            }
        ];
        this._dataSource = dataSource;
        this.isReady = this._initialize();
    }

    addAllowedRoute(route) {
        this._allowedRoutes.push(route)
    }

    /**
     *
     * @param route
     * @constructor
     */
    unshiftRoute(controller, controllerMethod, shouldSkip) {
        this._routes.unshift({
            controller:controller,
            controllerMethod:controllerMethod,
            shouldSkip:shouldSkip
        })
    }

    setUser(user) {
        let preExists = !!this._user;
        this._user = user;
        if(this._user){
            this.emit(preExists ? 'loginchange' : 'login', user);
        }

    }

    getUser() {
        return this._user;
    }

    getUID(){
        return this.getUser().uid;
    }

    async _executeRoute(rule, route) {
        await this.isReady;

        if (route.controller === 'Login' || this._allowedRoutes.includes(route.controller) || this._user) {
            super._executeRoute(rule, route);
        } else {
            let route = find(this._routes, (route) => !route.shouldSkip());
            this.go(route.controller, route.controllerMethod);
        }
    }
    
    async _initialize() {
        /* TODO: add timeout to early exit when user launches app without network */
        let dataSource = Injection.get(DataSource);
        this.setUser(await dataSource.getAuth());
    }
}