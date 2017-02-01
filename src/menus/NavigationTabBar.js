/**
 * Created by lundfall on 01/02/2017.
 */

import get                  from 'lodash/get.js';
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
            showAnimation: {transition: {duration: 0, curve: Easing.outBack}},
            hideAnimation: {transition: {duration: 0, curve: Easing.outBack}},
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
        this.UIBar.animationController.show(this.UIBar, this.options.showAnimation || {transition: {duration: 0}});
        this.layout.reflowLayout();
    }

    hide() {
        this.UIBar.animationController.hide(this.options.hideAnimation  || {transition: {duration: 0}}, () => {
            this.UIBar.decorations.dock.size[1] = 0;
            this.layout.reflowLayout();
        });
    }

    _onRouteChange({ controller, method }) {
        let tabs = this.options.tabsForRoutes;
        let items = get(tabs, `['${controller}']['${method}']`) || null;

        this.currentController = controller;
        if(this.currentItems !== items) { this.currentItems = items } else { return; }

        if (items) {
            this.UIBar.tabBar.setItems(items);
            this.show();
        } else {
            this.hide();
        }
    }

    _onTabChange(id, tabData) {
        if (tabData.goTo) {
            let { controller = this.currentController, method = 'Index', params } = tabData.goTo;
            this.router.go(controller, method, params);
        }
    }
}