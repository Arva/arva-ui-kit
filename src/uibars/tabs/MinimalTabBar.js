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

    constructor(options = {}) {
        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false, tabRenderable: MinimalTab, tabOptions: {inActiveColor: 'rgb(170,170,170)', activeColor: 'black'}}));
    }
}