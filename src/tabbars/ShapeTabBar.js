/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Colors}             from 'arva-kit/defaults/DefaultColors.js';
import {TabBar}             from './TabBar.js';
import {ShapeTab}           from './ShapeTab.js';

const flowOptions = {flow: true, transition: {curve: Easing.outCubic, duration: 200}};

export class ShapeTabBar extends TabBar {

    @layout.size(function () {
        return this.options.shapeWidth || 0
    }, function () {
        return this.options.shapeHeight || 32
    })
    @layout.align(0, 0.5)
    @layout.origin(0, 0.5)
    @flow.defaultOptions(flowOptions)
    shape = new Surface({
        properties: {
            backgroundColor: this.options.shapeColor || Colors.PrimaryUIColor,
            borderRadius: this.options.borderRadius
        }
    });

    /**
     * @example
     *
     * @layout.dock.top(~50)
     * shapeTabBar = new ShapeTabBar({activeIndex: 0, tabRenderable: ShapeIconTab, equalSizing: false, usesIcon: true, shapeWidth: 40, shapeHeight: 40});
     *
     * @param {Object} [options] Construction options
     * @param {Number} [options.shapeHeight] The initial height of the shape renderable
     * @param {Number} [options.shapeWidth] The initial width of the shape renderable
     * @param {String} [options.shapeColor] The color of the shape renderable
     * @param {Renderable} [options.tabRenderable] The renderable class of the Tabs
     * @param {Object} [options.tabOptions] The options passed to the tabRenderable
     * @param {String} [options.tabOptions.inActiveColor] The color of the tabRenderable when it's not active
     * @param {String} [options.tabOptions.activeColor] The color of the tabRenderable when it's active
     * @param {Array}  [items] The items to add to the TabBar on initialisation
     */
    constructor(options = {}, items) {

        if(options.rounded){
            options.borderRadius = '24px';
        }

        if (options.usesIcon) {
            options.borderRadius = "50%";
        }

        super(combineOptions({
            makeRipple: false, useBackground: false, useBoxShadow: false, shapeHeight: 32,
            shapeWidth: 0,
            borderRadius: '4px',
            shapeColor: Colors.PrimaryUIColor,
            tabRenderable: ShapeTab,
            tabOptions: {inActiveColor: Colors.PrimaryUIColor, activeColor: 'white'}
        }, options), items);
    }

    /**
     * Set item active, translating the shape to the active item
     * @param id
     * @param item
     */
    setItemActive(id, item) {
        this._currentItem = id;
        this.decorateRenderable('shape', layout.size(this.options.shapeWidth || this._getCurrentSize(id), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem), 0, 10));
    }

    setItemInactive(id, item) {
        item.setInactive();
    }

    onHover(id, item) {
        if (this.options.usesIcon) {
            return;
        }
        if (id === this._currentItem) {
            return this.decorateRenderable('shape', layout.size(this.options.shapeWidth || (this._getCurrentSize(this._currentItem)) - 24, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id) + 12, 0, 10));
        }
        if (id < this._currentItem) {
            this.decorateRenderable('shape', layout.size(this.options.shapeWidth || this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem) - 12, 0, 10))
        } else {
            this.decorateRenderable('shape', layout.size(this.options.shapeWidth || this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight))
        }
    }

    offHover(id, item) {
        this.decorateRenderable('shape', layout.size(this.options.shapeWidth || this._getCurrentSize(this._currentItem), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem), 0, 10))
    }
}