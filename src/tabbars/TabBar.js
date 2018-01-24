/**
 * Created by Manuel on 07/09/16.
 */
import {Surface}        from 'arva-js/surfaces/Surface.js';
import {View}           from 'arva-js/core/View.js';
import {combineOptions} from 'arva-js/utils/CombineOptions.js';
import {
    flow, layout, dynamic,
    bindings, event
}                       from 'arva-js/layout/Decorators.js';

import {Tab}            from './Tab.js';
import {AccountIcon}    from '../icons/AccountIcon.js';


/**
 * Base TabBar for the UIBar. Class is meant to be extended
 *
 *  Three different types:
 *      1. Minimal tabs
 *      2. Shape tabs, moving shapes
 *      3. Line tabs, same as Shape tabs but with a different shape
 *
 *  Icon tabs:
 *      new MinimalTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *      new ShapeTabBar({activeIndex: 0,tabRenderable: ShapeIconTab, equalSizing: false, usesIcon: true, shapeWidth: 40, shapeHeight: 40},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *      new LineTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *
 *  Text tabs:
 *      new MinimalTabBar({activeIndex: 0,tabOptions: {properties: {color: 'black'}}, equalSizing: false},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *      new ShapeTabBar({activeIndex: 0, equalSizing: false, shapeWidth: 40, shapeHeight: 40},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *      new LineTabBar({activeIndex: 0, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: false},[{content: 'one'}, {content:'two'}, {content: 'three'}]);
 *
 * @param {Object} [options] Construction options
 * @param {Array} [items] The items to populate the TabBar with
 * @param {Object} [options.tabRenderable] A class that extends Tab, used for each of the rendered tabs
 * @param {Object} [options.backgroundOptions] Passed to the background of the tabBar
 * @param {Object} [options.tabOptions] The options to pass to a tab renderable, for more info see TextButton.js/Clickable.js
 * @param {Boolean} [options.equalSizing] Whether the tab renderables should be evenly spaced and sized or whether it should not (thus docking.left with the size of the renderable)
 * @param {Number} [options.activeIndex] The index that should be active on initialisation
 * @param {Boolean} [options.reflow] Whether the TabBar should automatically reflow the active shape to the current active renderable
 * @param {Boolean} [options.usesIcon] Wheter the TabBar uses Icons or text. Defaults to false
 * @fires TabBar#tabClick Emits a tabClick event once a tab renderable is clicked, with [id, tabData] as parameters. Content can be overwritten by setting tabOptions.clickEventData {Array}
 */
@bindings.setup({
    equalSizing: false,
    activeIndex: 0,
    reflow: true,
    usesIcon: false,
    tabSpacing: 24,
    tabOptions: {clickEventName: 'tabClick'},
    tabs: [{active: false}],
    cachedItemSizes: [{width: 0, height: 0}],
    tabRenderable: Tab
})
export class TabBar extends View {


    @bindings.trigger()
    setupActiveIndex(options, defaultOptions) {
        let {tabs = defaultOptions.tabs} = options;
        let currentActiveItemIndex = tabs.findIndex(({active}) => active);
        if (currentActiveItemIndex === -1) {
            tabs[options.activeIndex].active = true;
        }
        /*
        if (defaultOptions.activeIndex !== options.activeIndex && options.activeIndex !== currentActiveItemIndex) {
            throw new Error('currentItem.index not consistent with items[options.activeIndex].active');
        }
        */

        if (currentActiveItemIndex !== -1) {
            options.activeIndex = currentActiveItemIndex;
        }

        if (!options.cachedItemSizes) {
            options.cachedItemSizes = new Array(tabs.length);
        }
    }

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface(this.options.backgroundOptions);


    @dynamic(({equalSizing, tabs, tabSpacing}) =>
        layout.dock.left(equalSizing ? 1 / tabs.length : ~50).dockSpace(equalSizing ? 0 : tabSpacing).size(undefined, ~30).stick.center()
    )
    items = this.options.tabs.map((tabOptions, index) =>
        /*  TODO rename events that start with hover that actually refers to "press" */
        event
            .on('activate', () => this._handleItemActive(index))
            .on('hoverOn', () => this.onHover(index))
            .on('hoverOff', () => this.offHover(index))
            .on('buttonClick', (index) => this.offHover(index))
            .on('newSize', (newSize) => this.options.cachedItemSizes[index] = {width: newSize[0], height: newSize[1]},
                {propagate: false}
            )
            (
                this.options.tabRenderable.with({
                    ...this.options.tabOptions,
                    icon: tabOptions.icon,
                    content: tabOptions.content,
                    active: this.inputOptions.tabs[index].active,
                    clickEventData: [index]
                })
            )
    );

    /**
     * Returns the active tab index of the TabBar
     * @returns {number|Number|*}
     */
    getActiveIndex() {
        return this.options.activeIndex;
    }

    /**
     * Layout new items in the tabBar, overwriting the old items
     * @param items
     */
    setItems(items = []) {
        this._setItems(items);
    }

    /* Layout and display the items in the TabBar */
    _setItems(items) {
        /* Should be overwritten */
    }

    /**
     * Returns the items in the TabBar
     * @returns {{}|*|Array|DataTransferItemList}
     */
    getItems() {
        return this.items;
    }

    getSize() {
        return [super.getSize()[0], 48];
    }

    /**
     * Set a tabBar item to active
     * @param index
     */
    setIndexActive(index) {
        this._handleItemActive(index);
    }

    _handleItemActive(activeIndex) {
        /* If not changed, then return */
        if(activeIndex === this.options.activeIndex){
            return;
        }
        this.options.activeIndex = activeIndex;
        this._eventOutput.emit('tabSwitch', activeIndex);
        for (let [index, tab] of this.items.entries()) {
            tab.options.active = index === parseInt(activeIndex);
        }

    }


    constructor(options) {
        let {tabs = [], activeIndex = 0} = options;
        options.tabs = tabs.map((tab, index) => ({...tab, nested: {active: activeIndex === index}}));
        super(options);
    }
}
