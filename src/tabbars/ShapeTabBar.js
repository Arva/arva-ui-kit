/**
 * Created by Manuel on 06/09/16.
 */

import Surface                  from 'famous/core/Surface.js';
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
        _shapeTranslate: [0, 0, 10],
        shapeSize: [0, 32],
        tabRenderable: ShapeTab,
        tabOptions: { inActiveColor: Colors.PrimaryUIColor, activeColor: 'white' },
        borderRadius: '4px',
        rounded: false,
        shapeColor: Colors.PrimaryUIColor
    })
@bindings.preprocess(options => {
    if (!options.usesIcon) {
        options.borderRadius = undefined;
    }
    if (options.rounded) {
        options.borderRadius = '50%';
    }
})
@bindings.preprocess(options => {
    options._shapeWidth = options.cachedItemSizes && options.cachedItemSizes[options.activeIndex] && options.cachedItemSizes[options.activeIndex].width || 0;
})
export class ShapeTabBar extends TabBar {

    @layout.align(0, 0.5)
    @layout.origin(0, 0.5)
    @dynamic(({ _shapeWidth, _shapeHeight, _shapeTranslate, shapeSize }) =>
        layout
            .size(shapeSize[0] || _shapeWidth, _shapeHeight)
            .translate(..._shapeTranslate)
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
     * @param {Renderable} [options.tabRenderable] The renderable class of the Tabs
     * @param {Object} [options.tabOptions] The options passed to the tabRenderable
     * @param {String} [options.tabOptions.inActiveColor] The color of the tabRenderable when it's not active
     * @param {String} [options.tabOptions.activeColor] The color of the tabRenderable when it's active
     * @param {Array}  [options.items] The items to add to the TabBar on initialisation
     */
    constructor(options = {}, items) {
        super(options);
    }


    onHover(id) {
        let { options } = this;
        options._isHovering = true;
        options._shapeWidth -= 20;
        options._currentlyHoveringIndex = id;
    }

    offHover(id) {
        let {options} = this;
        options._isHovering = false;
        options._shapeTranslate = [this._calcCurrentPosition(id), 0, 10];
    }
}