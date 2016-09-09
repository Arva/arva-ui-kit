/**
 * Created by Manuel on 07/09/16.
 */

import Surface                              from 'famous/core/Surface.js';
import {View}                               from 'arva-js/core/View.js';
import {layout}                             from 'arva-js/layout/Decorators.js';
import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import FlexTabBar                           from 'famous-flex/widgets/TabBar.js';
import {Tab}                                from './Tab.js';

import {DockLeftLayout, EqualSizeLayout}    from './TabBarHelperFunctions.js';

/** @example
 *  Three different types:
 *      1. Minimal tabs
 *      2. Shape tabs, moving shapes
 *      3. Line tabs, same as Shape tabs but with a different shape
 *
 *  Icon tabs:
 *      new MinimalTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true});
 *      new ShapeTabBar({activeIndex: 0,tabRenderable: ShapeIconTab, equalSizing: false, usesIcon: true, shapeWidth: 40, shapeHeight: 40});
 *      new LineTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true});
 *
 *  Text tabs:
 *
 */
export class TabBar extends View {

    /* Number of items in the tabBar */
    _itemCount = 0;

    /* Current active item */
    _currentItem = 0;

    /* Current _width of the TabBar */
    _width = 0;

    constructor(options = {tabOptions: {}}, items = [{content: 'test'},{content: 'test'}, {content: 'test'}, {content: 'test'}, {content: 'test'}]){
        super(combineOptions({equalSizing: false, activeIndex: 0, reflow: true}, options));

        this.on('newSize', ([_width]) => {
            this._width = _width;
            this.options.reflow && this.setIndexActive(this._currentItem);
        });

        /* Bind helper functions to this class depending on layout options */
        let source = this.options.equalSizing ? EqualSizeLayout : DockLeftLayout;
        for(let index of Object.keys(source)){
            this[index] = source[index].bind(this);
        }

        this._setItems(items);

        if(this.options.activeIndex != undefined){
            this.setIndexActive(this.options.activeIndex);
        }

    }

    setItems(items = []){
        this._setItems(items);
    }

    /* Layout and display the items in the TabBar */
    _setItems(items) {
       /* Should be overwritten */
    }

    _registerTabListeners(tab, index) {
        tab.on('activate', this._handleItemActive.bind(this, index, tab));
        tab.on('hoverOn', this.onHover.bind(this, index, tab));
        tab.on('hoverOff', this.offHover.bind(this, index, tab));
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

    getItem(index){
        /* Should be overwritten */
    }

    getItems() {
        return this.items;
    }

    setIndexActive(index){
        this._handleItemActive(index, this.getItem(index))
    }
}
