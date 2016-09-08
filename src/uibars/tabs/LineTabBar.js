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

    @layout.size(0, function(){return this.options.shapeHeight || 4})
    @layout.dock.bottom(4)
    @flow.defaultOptions(flowOptions)
    shape = new Surface({
        properties: {
            'background-color': this.options.shapeColor
        }
    });

    constructor(options = {shapeColor: Colors.PrimaryUIColor, shapeHeight: 4, tabOptions: {}, tabRenderable: LineTab}) {
        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false}));
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