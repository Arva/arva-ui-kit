/**
 * Created by Manuel on 06/09/16.
 */
import Easing               from 'famous/transitions/Easing.js';
import Surface              from 'famous/core/Surface.js';
import {bindings}           from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {TabBar}             from './TabBar.js';
import {LineTab}            from './LineTab.js';
import {Colors}             from 'arva-kit/defaults/DefaultColors.js';
import {ShapeTabBar}        from './ShapeTabBar';


@bindings.setup({
    borderRadius: '0px',
    _shapeHeight: 4,
    tabOptions: {passiveOpacity: 0.6},
    _shapeYOffset: 18
})
export class LineTabBar extends ShapeTabBar {



}