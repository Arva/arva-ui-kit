/**
 * Created by Manuel on 07/09/16.
 */
import Surface                              from 'famous/core/Surface.js';
import {View}                               from 'arva-js/core/View.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';
import {layout}                             from 'arva-js/layout/Decorators.js'

import {DockLeftLayout, EqualSizeLayout}    from './TabBarHelperFunctions.js';

export class TabBar extends View {

    /* Number of items in the tabBar */
    _itemCount = 0;

    /* Current active item */
    _currentItem = null;

    /* Current _width of the TabBar */
    _width = 0;

    @layout.translate(0, 0, -10)
    @layout.fullSize()
    background = new Surface(this.options.backgroundOptions);

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
     * @param {Object} [options.tabOptions] The options to pass to a tab renderable, for more info see WhiteTextButton.js/Clickable.js
     * @param {Boolean} [options.equalSizing] Whether the tab renderables should be evenly spaced and sized or whether it should not (thus docking.left with the size of the renderable)
     * @param {Number} [options.activeIndex] The index that should be active on initialisation
     * @param {Boolean} [options.reflow] Whether the TabBar should automatically reflow the active shape to the current active renderable
     * @param {Boolean} [options.usesIcon] Wheter the TabBar uses Icons or text
     * @fires TabBar#tabClick Emits a tabClick event once a tab renderable is clicked, with [id, tabData] as parameters. Content can be overwritten by setting tabOptions.clickEventData {Array}
     */
    constructor(options = {tabOptions: {}}, items = []) {
        super(combineOptions({
            equalSizing: false,
            activeIndex: 0,
            reflow: true,
            tabOptions: {clickEventName: 'tabClick'}
        }, options));


        /* Bind helper functions to this class depending on layout options */
        let source = this.options.equalSizing ? EqualSizeLayout : DockLeftLayout;
        for (let index of Object.keys(source)) {
            this[index] = source[index].bind(this);
        }


        this.onceNewSize().then(([width]) => {
            this._width = width;

            if (!this.getItems()) {
                this._setItems(items);
            }

            this.onNewSize(([width]) => {
                this._width = width;
                this.options.reflow && this.setIndexActive(this._currentItem);
            });

            if(this._currentItem !== this.options.activeIndex){
                this.setIndexActive(this.options.activeIndex);
            }

        });

        if (this.options.activeIndex !== undefined) {
            this.setIndexActive(this.options.activeIndex);
        }

    }

    /**
     * Returns the active tab index of the TabBar
     * @returns {number|Number|*}
     */
    getActiveIndex(){
        return this.options.activeIndex;
    }

    /**
     * Layout new items in the tabBar, overwriting the old items
     * @param items
     */
    setItems(items = []) {
        this._setItems(items);

        this.onceNewSize().then(([width])=>{
            this._width = width;
            this.options.reflow && this.setIndexActive(this._currentItem);
        });
    }

    /* Layout and display the items in the TabBar */
    _setItems(items) {
        /* Should be overwritten */
    }

    _registerTabListeners(tab, index) {
        tab.on('activate', this._handleItemActive.bind(this, index, tab));
        tab.on('hoverOn', this.onHover.bind(this, index, tab));
        tab.on('hoverOff', this.offHover.bind(this, index, tab));
        tab.pipe(this._eventOutput);
    }

    _calcCurrentPosition(id) {
        /* Should be overwritten */
    }

    _getCurrentSize(index) {
        /* Should be overwritten */
    }

    onHover(id, item) {
        /* To be inherited */
    }

    offHover(id, item) {
        /* To be inherited */
    }

    setItemActive(id, item) {
        /* To be inherited */
    }

    setItemDeactive(id, item) {
        /* To be inherited */
    }

    getItem(index) {
        /* Should be overwritten */
    }

    /**
     * Returns the items in the TabBar
     * @returns {{}|*|Array|DataTransferItemList}
     */
    getItems() {
        return this.items;
    }

    /**
     * Set a tabBar item to active
     * @param index
     */
    setIndexActive(index) {
        setTimeout(() => {
            this.options.activeIndex = index;
            if (!this._width) {
                this.onceNewSize().then(() => {
                    /* Read the active index from the option if overridden in subsequent calls to make resilient to race conditions */
                    this._handleItemActive(this.options.activeIndex, this.getItem(this.options.activeIndex));
                })
            } else {
                this._handleItemActive(index, this.getItem(index));
            }
        }, 1000)

    }
}
