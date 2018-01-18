/**
 * Created by Manuel on 06/09/16.
 */

import {Surface}        from 'arva-js/surfaces/Surface.js';
import Easing                   from 'famous/transitions/Easing.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {
    flow, layout, dynamic,
    bindings
}                               from 'arva-js/layout/Decorators.js';
import {flowStates}             from 'arva-js/layout/FlowStates.js';
import {Colors}                 from 'arva-kit/defaults/DefaultColors.js';
import {TabBar}                 from './TabBar.js';
import {ShapeTab}               from './ShapeTab.js';

const flowOptions = { flow: true, transition: { curve: Easing.outCubic, duration: 200 } };

@bindings.setup(
    {
        makeRipple: false,
        useBackground: false,
        useBoxShadow: false,
        _shapeWidth: 0,
        _shapeHeight: 32,
        _isHovering: false,
        _currentlyHoveringIndex: 0,
        _shapeXOffset: 0,
        _shapeYOffset: 0,
        shapeSize: [0, 32],
        tabRenderable: ShapeTab,
        tabOptions: { inActiveColor: Colors.PrimaryUIColor, activeColor: 'white' },
        borderRadius: '4px',
        rounded: false,
        shapeColor: Colors.PrimaryUIColor
    })
export class ShapeTabBar extends TabBar {

    @bindings.trigger()
    setIconProps(options) {
        if (!options.usesIcon) {
            options.borderRadius = undefined;
        }
        if (options.rounded) {
            options.borderRadius = '50%';
        }
    }

    @bindings.trigger()
    moveShape() {
        this.options._shapeXOffset = this._calcCurrentPosition(this.options.activeIndex);
    }

    @bindings.trigger()
    setShapeWidth(options) {
        options._shapeWidth = options.cachedItemSizes && options.cachedItemSizes[options.activeIndex] && options.cachedItemSizes[options.activeIndex].width || 0;
    }


    @layout.align(0, 0.5)
    @layout.origin(0, 0.5)
    @dynamic(({ _shapeWidth, _shapeHeight, _shapeXOffset, _shapeYOffset, shapeSize }) =>
        layout
            .size(shapeSize[0] || _shapeWidth, _shapeHeight)
            .translate(_shapeXOffset, _shapeYOffset, 10)
    )
    @flow.defaultOptions(flowOptions)
    shape = Surface.with({
        properties: {
            backgroundColor: this.options.shapeColor,
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
     * @param {Class} [options.tabRenderable] The renderable class of the Tabs
     * @param {Object} [options.tabOptions] The options passed to the tabRenderable
     * @param {String} [options.tabOptions.inActiveColor] The color of the tabRenderable when it's not active
     * @param {String} [options.tabOptions.activeColor] The color of the tabRenderable when it's active
     * @param {Array}  [options.items] The items to add to the TabBar on initialisation
     */
    constructor(options = {}) {
        super(options);
        this.on('newSize', (newSize) => this._currentSize = newSize, {propagate: false});
    }


    onHover(index) {
        let { options } = this;
        options._isHovering = true;

        if(index < options.activeIndex){
            options._shapeXOffset -= 12;
        }
        if (index === options.activeIndex){
            this._shrunk = true;
            options._shapeWidth -= 12;
            options._shapeXOffset += 6;
        } else {
            options._shapeWidth += 12;
        }
        options._shapeWidth = Math.max(options._shapeWidth, 0);
        options._currentlyHoveringIndex = index;
    }

    offHover(id) {
        this.moveShape(this.options);
        this.setShapeWidth(this.options);
        let {options} = this;
        options._isHovering = false;
    }

    _handleItemActive(activeIndex) {
        super._handleItemActive(activeIndex);
        this.offHover(activeIndex);
    }

    getSize() {
        return [super.getSize()[0], 40];
    }

    /**
     * Calculates the current position for the selected item
     * @param index
     * @returns {number}
     * @private
     */
    _calcCurrentPosition(index) {
        if (this.options.equalSizing) {
            return this._currentSize ? (this._currentSize[0] *
                ((this.options.tabs.length - 1) / this.options.tabs.length)) *
                (index / (this.options.tabs.length - 1)) : 0;
        }

        return this.options.cachedItemSizes
            .slice(0, index)
            .reduce((totalWidth, {width = 0}) =>
                totalWidth + width
                , 0) + this.options.tabSpacing * index;
    }

}