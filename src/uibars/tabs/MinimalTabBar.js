/**
 * Created by Manuel on 08/09/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Colors}             from 'arva-kit/defaults/DefaultColors.js';

import {TabBar}             from './TabBar.js';
import {MinimalTab}         from './MinimalTab.js';

export class MinimalTabBar extends TabBar {

    /**
     * @example
     *
     * @layout.dock.top(~50)
     * minimalTabBar = new MinimalTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true});
     *
     * @param {Object} [options] Construction options
     * @param {Renderable} [options.tabRenderable] The renderable class of the Tabs
     * @param {Object} [options.tabOptions] The options passed to the tabRenderable
     * @param {String} [options.tabOptions.inActiveColor] The color of the tabRenderable when it's not active
     * @param {String} [options.tabOptions.activeColor] The color of the tabRenderable when it's active
     * @param {Array}  [items] The items to add to the TabBar on initialisation
     */
    constructor(options = {}, items = []) {
        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false, tabRenderable: MinimalTab, tabOptions: {inActiveColor: 'rgb(170,170,170)', activeColor: 'black'}}),items);
    }
}