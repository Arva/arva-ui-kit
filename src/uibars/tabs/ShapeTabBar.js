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

const transition = {curve: Easing.outCubic, duration: 300};

export class ShapeTabBar extends TabBar {

    @layout.size(0, function(){return this.options.shapeHeight || 32})
    @layout.align(0, 0.5)
    @layout.origin(0, 0.5)
    @flowStates.fade('active', {opacity: 1})
    @flowStates.fade('inactive')
    shape = new Surface({
        properties: {
            'background-color': this.options.shapeColor || Colors.PrimaryUIColor,
            'border-radius': '16px'
        }
    });

    constructor(options = {shapeHeight: 32, shapeColor: Colors.PrimaryUIColor, tabRenderable: ShapeTab, tabOptions: {inActiveColor: Colors.PrimaryUIColor, activeColor: 'white'}}) {
        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false}));
    }

    setItemActive(id, item) {
        this.currentItem = id;
        this.decorateRenderable('shape', layout.size(this._getCurrentSize(id), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id), 0, 10));
    }

    setItemInactive(id, item ) {
        item.setInactive();
    }

    onHover(id, item) {
        if (id === this.currentItem) {
            return this.decorateRenderable('shape', layout.size((this._getCurrentSize(this.currentItem)) - 24, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(id) + 12, 0, 10));
        }
        if (id < this.currentItem) {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this.currentItem) + 12, this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this.currentItem) - 12, 0, 10))
        } else {
            this.decorateRenderable('shape', layout.size(this._getCurrentSize(this.currentItem) + 12, this.options.shapeHeight))
        }
    }

    offHover(id, item) {
        this.decorateRenderable('shape', layout.size(this._getCurrentSize(this.currentItem), this.options.shapeHeight), layout.translate(this._calcCurrentPosition(this.currentItem), 0, 10))
    }
}