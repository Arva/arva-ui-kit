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
        return this.options.shapeHeight
    })
    @layout.stick.bottomLeft()
    @layout.translate(0, 1, 10)
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
            shapeHeight: 2,
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

        this._currentTab && this._currentTab._deactive  && this._currentTab.setInactive();
        this._currentItem = id;
        this._currentTab = item;

        if (this.options.calculatedShapeWidth) {
            setTimeout(() => {
                let tabSize = this._currentTab.getSize()[0];
                this.decorateRenderable('shape', layout.size(tabSize, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id), 1, 10))
            }, 100);
        } else {
            this.decorateRenderable('shape', layout.size(this.options.shapeWidth || this._getCurrentSize(id), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id), 1, 10))
        }

        this._currentTab && this._currentTab._deactive  && this._currentTab.setActive();
    }

    setItemDeactive(id, item) {
        //item._deactivate();
    }

    onHover(id, item) {

        /* Reshrink shape */
        if (id === this._currentItem) {
            return this.decorateRenderable('shape', layout.size((this._getCurrentSize(this._currentItem)) - 24, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id) + 12, 1, 10));
        }

        /* Expand shape with 12px to the hovered renderable */
        if (id < this._currentItem) {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem) - 12, 1, 10))
        } else {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem) + 12, this.options.shapeHeight))
        }
    }

    offHover(id, item) {
        this.decorateRenderable('shape', layout.size(this._getCurrentSize(this._currentItem), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this._currentItem), 1, 10))
    }
}