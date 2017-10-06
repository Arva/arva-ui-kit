/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Tab}                from './Tab.js';
import {Colors}             from '../defaults/DefaultColors.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

@layout.dockPadding(0)
export class LineTab extends Tab {

    @layout.translate(0, 0, 30)
    @layout.dock.top()
    @layout.size(~300, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 0.5, color:Colors.PrimaryUIColor}, flowOptions)
    @flowStates.fade('inactive', {opacity: 1, color:Colors.BasicTextColor}, flowOptions)
    text = new Surface(this.options);

    constructor(options = {}) {
        super(options);
    }

    setActive() {
        this.text.setProperties({color: Colors.PrimaryUIColor})
    }

    setInactive() {
        this.text.setProperties({color: Colors.BasicTextColor})
    }

    _activate() {
    }

    _deactivate() {
    }

}