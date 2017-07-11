/**
 * Created by lundfall on 01/02/2017.
 */

import FamousContext        from 'famous/core/Context.js';
import Easing               from 'famous/transitions/Easing.js';

import {View}               from 'arva-js/core/View.js';
import {Router}             from 'arva-js/core/Router.js';
import {UIBar}              from 'arva-kit/uibars/UIBar.js';
import {Injection}          from 'arva-js/utils/Injection.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {LineTabBar}         from 'arva-kit/tabbars/LineTabBar.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

export class GlobalTabBar extends View {

    @layout.translate(0, 0, 100)
    @layout.dock.top(true)
    @layout.animate({ showInitially: true })
    get UIBar() {
        const router = Injection.get(Router);

        let activeTabIndex = this._findTabIndex({
            controller: router.defaultController,
            method: router.defaultMethod
        });

        if(activeTabIndex === -1){
            activeTabIndex = undefined;
        }
        return new this.options.UIBarType({
            components: [[new this.options.tabBarType({
                ...this.options,
                activeIndex: activeTabIndex
            }, this.options.tabs), 'tabBar', 'fill']],
            ...this.options.UIBarOptions
        });
    }

    constructor(options = {}) {
        super(combineOptions({
            tabsForRoutes: {},
            tabBarType: LineTabBar,
            UIBarType: UIBar,
            items: [],
            UIBarOptions: { bottomLine: true, shadowType: 'noShadow' },
            tabOptions: { properties: { color: 'rgb(0, 0, 0)' } },
            equalSizing: true,
            showAnimation: { transition: { duration: 0, curve: Easing.outBack } },
            hideAnimation: { transition: { duration: 0, curve: Easing.outBack } },
            ...options

        }));

        this.items = [];

        const famousContext = Injection.get(FamousContext);
        this.router = Injection.get(Router);

        /* Hijack Famous Context's add() method */
        famousContext.add(this);
        if (!famousContext.addToRoot) {
            famousContext.addToRoot = famousContext.add.bind(famousContext);
        }
        famousContext.add = this.addToContent;
        this.idCounter = 0;

        this.router.on('routechange', this._onRouteChange);
        this.UIBar.tabBar.on('tabClick', this._onTabChange);

        if(this.options.tabs){
            this.setItems(this.options.tabs);
        }

        if(this.options.items){
            this.setItems(this.options.items);
        }
    }

    setItems(items){
        this.items = items;
        this.UIBar.tabBar.setItems(items);
    }

    addToContent(renderable) {
        this.addRenderable(renderable, `renderable${this.idCounter++}`, layout.dock.fill());
    }


    _onRouteChange({ controller, method = 'Index' }) {
        this._setTabIndexFromRoute({ controller, method });
    }

    _setTabIndexFromRoute(route) {
        const index = this._findTabIndex(route);
        if (index !== -1) {
            this.UIBar.tabBar.setIndexActive(index);
        } else {
            console.log('Warning: No knowledge on what tab to set here');
        }
    }

    refreshIndex(){
       let route = this.router.getRoute();
       this._setTabIndexFromRoute(route);
    }

    _findTabIndex({ controller, method = 'Index' }) {
        if(this.items === undefined){
            this.items = [];
        }
        return this.items.findIndex(({ goTo }) => goTo && goTo.controller === controller && (goTo.method === method || !goTo.method));
    }

    _onTabChange(id, tabData) {
        if (tabData.goTo) {
            if (typeof tabData.goTo === 'object') {
                const { controller = this.currentController, method = 'Index', params } = tabData.goTo;
                this.router.go(controller, method, params);
            }
            if (typeof tabData.goTo === 'string') {
                window.open(tabData.goTo,'_blank');
            }
        }
    }
}
