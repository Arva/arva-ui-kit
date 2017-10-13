/**
 * Created by lundfall on 2/27/17.
 */
import Surface              from 'arva-js/famous/core/Surface.js';

import {layout, flow, event}from 'arva-js/layout/Decorators.js'
import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {LineTabBar}         from 'arva-kit/tabbars/LineTabBar.js';

export class TabBarView extends View {

    @layout.translate(0, 0, 50)
    @layout.dock.top(48)
    tabBar = new this.options.tabBarClass(
        this.options
    , this.options.tabs);

    @layout.animate()
    @layout.stick.bottom()
    @layout.size(undefined, (width, height) => height-12)
    @layout.dock.fill()
    currentView = this.options.tabs[this.options.activeIndex].view;

    /**
     * tabs: An array with objects that should have 'content' and 'view' set
     * @param options
     */
    constructor(options = {}) {
        super(combineOptions({
            tabBarClass: LineTabBar,
            tabs: [],
            activeIndex: 0,
            equalSizing: true
        }, options));
        this.tabBar.on('tabClick', this._onTabChange);

        }

    _onTabChange(id, tabData) {
        this.switchToView(tabData.view)
    }


    getView() {
        return this.currentView;
    }

    switchToView(view) {
        this.hideRenderable(this.currentView);
        this.replaceRenderable(this.currentView, view);
        this.showRenderable(this.currentView);
    }
}
