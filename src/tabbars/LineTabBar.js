/**
 * Created by Manuel on 06/09/16.
 */
import Easing               from 'famous/transitions/Easing.js';
import Surface              from 'famous/core/Surface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {TabBar}             from './TabBar.js';
import {LineTab}            from './LineTab.js';
import {Colors}             from 'arva-kit/defaults/DefaultColors.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class LineTabBar extends TabBar {

    @layout.size(0, function () {
        return this.options.shapeHeight || 4
    })
    @layout.stick.bottomLeft()
    @flow.defaultOptions(flowOptions)
    shape = new Surface({
        properties: {
            backgroundColor: this.options.shapeColor
        }
    });

    /**
     * @example
     *
     * @layout.dock.top(~50)
     * lineTabBar = new LineTabBar({activeIndex: 0, tabRenderable: IconTab, tabOptions: {properties: {color: 'rgb(170,170,170)'}}, equalSizing: true, usesIcon: true});
     *
     * @param {Object} [options] Construction options
     * @param {Number} [options.shapeHeight] The initial height of the shape renderable
     * @param {String} [options.shapeColor] The color of the shape renderable
     * @param {Renderable} [options.tabRenderable] The renderable class of the Tabs
     * @param {Object} [options.tabOptions] The options passed to the tabRenderable
     * @param {String} [options.tabOptions.inActiveColor] The color of the tabRenderable when it's not active
     * @param {String} [options.tabOptions.activeColor] The color of the tabRenderable when it's active
     * @param {Array}  [items] The items to add to the TabBar on initialisation
     */
    constructor(options = {}, items = []) {
        super(combineOptions({
            makeRipple: false,
            useBackground: false,
            useBoxShadow: false,
            shapeColor: Colors.PrimaryUIColor,
            shapeHeight: 4,
            tabOptions: {},
            tabRenderable: LineTab
        }, options), items);
    }

    /**
     * Set an item active, translating the shape to the newly activated item
     * @param id
     * @param item
     */
    setItemActive(id, item) {
        this._currentItem = id;
        this.decorateRenderable('shape', layout.size(this._getCurrentSize(id), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id), 0, 10))
    }

    setItemDeactive(id, item) {

    }

    onHover(id, item) {

        /* Reshrink shape */
        if (id === this._currentItem) {
            return this.decorateRenderable('shape', layout.size((this._getCurrentSize(this._currentItem)) - 24, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id) + 12, 0, 10));
        }

        /* Expand shape with 12px to the hovered renderable */
        if (id < this._currentItem) {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem) - 12, 0, 10))
        } else {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight))
        }
    }

    offHover(id, item) {
        this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem), 0, 10))
    }
}