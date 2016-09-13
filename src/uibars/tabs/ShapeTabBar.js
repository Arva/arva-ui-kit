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
            'background-color': this.options.shapeColor || Colors.PrimaryUIColor,
            'border-radius': this.options.borderRadius || '16px'
        }
    });

    constructor(options = {
        shapeHeight: 32,
        shapeWidth: 0,
        shapeColor: Colors.PrimaryUIColor,
        tabRenderable: ShapeTab,
        tabOptions: {inActiveColor: Colors.PrimaryUIColor, activeColor: 'white'}
    }) {

        if (options.usesIcon) {
            options.borderRadius = "50%";
        }

        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false}));
    }

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