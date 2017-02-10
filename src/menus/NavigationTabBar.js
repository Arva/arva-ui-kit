/**
 * Created by tom on 01/02/2017.
 */

import get                  from 'lodash/get.js';
import findIndex            from 'lodash/findIndex.js';
import FamousContext        from 'famous/core/Context.js';
import Easing               from 'famous/transitions/Easing.js';

import {View}               from 'arva-js/core/View.js';
import {Router}             from 'arva-js/core/Router.js';
import {UIBar}              from 'arva-kit/uibars/UIBar.js';
import {Injection}          from 'arva-js/utils/Injection.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {LineTab}            from 'arva-kit/tabbars/LineTab.js';
import {LineTabBar}         from 'arva-kit/tabbars/LineTabBar.js';
import {MinimalTab}         from 'arva-kit/tabbars/MinimalTab.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Dimensions}         from 'arva-kit/defaults/DefaultDimensions.js';

export class NavigationTabBar extends View {

    @layout.dock.top(true)
    @layout.translate(0, 0, 1000)
    @layout.animate({showInitially: true})
    UIBar = new UIBar({
        components: [[new this.options.tabBarType({ ...this.options, equalSizing: true }), 'tabBar', 'fill']],
        ...this.options.UIBarOptions
    });

    constructor(options = {}) {
        super(combineOptions({
            tabsForRoutes: {},
            tabBarType: LineTabBar,
            UIBarOptions: { bottomLine: true, shadowType: 'noShadow' },
            tabOptions: { properties: { color: 'rgb(0, 0, 0)' } },
            showAnimation: { transition: { duration: 0, curve: Easing.outBack } },
            hideAnimation: { transition: { duration: 0, curve: Easing.outBack } },
            ...options
        }));

        let famousContext = Injection.get(FamousContext);
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
    }

    addToContent(renderable) {
        this.addRenderable(renderable, `renderable${this.idCounter++}`, layout.dock.fill());
    }

    show() {
        this.UIBar.decorations.dock.size[1] = Dimensions.UIBarHeight;
        this.UIBar.animationController.show(this.UIBar, this.options.showAnimation || { transition: { duration: 0 } });
        this.layout.reflowLayout();
    }

    hide() {
        this.UIBar.animationController.hide(this.options.hideAnimation || { transition: { duration: 0 } }, () => {
            this.UIBar.decorations.dock.size[1] = 0;
            this.layout.reflowLayout();
        });
    }

    setParamsForPath(controller, method = null, params = {}) {
        let tabs = get(this.options.tabsForRoutes, method ? `[${controller}][${method}]` : `[${controller}]`);
        if (tabs) {
            for (let tab of tabs) {
                tab.goTo.params = params;
            }
        }
    }

    _onRouteChange({ controller, method }) {
        let paths = this.options.tabsForRoutes;

        /* Check if a controller + method path is set */
        let methodSpecificTabs = get(paths, `['${controller}']['${method}']`);

        /* Otherwise, check if a path was set for just the controller */
        let globalControllerTabs = get(paths, `['${controller}']`);

        /* Determine which tabs to show, if any, starting with the most specific ones */
        let tabs = methodSpecificTabs || (globalControllerTabs instanceof Array ? globalControllerTabs : null) || null;

        this.currentController = controller;

        if (tabs) {

            if (this.currentItems !== tabs) {
                this.currentItems = tabs
            } else {
                /* Even though the tabs haven't changed, the active tab might be a different one */
                return this._setCorrectActiveTab(controller, method, tabs);
            }

            this.UIBar.tabBar.setItems(tabs);
            this.show();
            this._setCorrectActiveTab(controller, method, tabs);
        } else {
            this.currentItems = null;
            this.hide();
        }

    }

    _setCorrectActiveTab(controller, method, tabs) {
        let activeTabIndex = findIndex(tabs, (tab) => tab.goTo.method === method &&
        (!tab.goTo.controller || tab.goTo.controller === controller));
        if (activeTabIndex >= 0) {
            this.UIBar.tabBar.setIndexActive(activeTabIndex);
        }
    }

    _onTabChange(id, tabData) {
        if (tabData.goTo) {
            let { controller = this.currentController, method = 'Index', params } = tabData.goTo;
            this.router.go(controller, method, params);
        }
    }
}