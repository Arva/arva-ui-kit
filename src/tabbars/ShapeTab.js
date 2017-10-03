/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import Easing               from 'famous/transitions/Easing.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}             from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Tab}                from './Tab.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class ShapeTab extends Tab {

    /* TODO: It's a bit shady to override this property from TextButton */
    @layout.translate(0, 0, 30)
    @layout.dock.top()
    @layout.size(~50, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 0.5}, flowOptions)
    @flowStates.fade('inactive', {opacity: 1}, flowOptions)
    text = new Surface(this.options);

    constructor(options = {}) {
        super(combineOptions({activeColor: 'white'}, options));
    }

    setActive() {
        this.text.setProperties({
            color: this.options.activeColor
        })
    }

    setInactive() {
        this.text.setProperties({
            color: this.options.inActiveColor
        });
    }

    activate() {
        super.activate();
        this.setRenderableFlowState(this.text, 'active');
    }

    deactivate() {
        super.deactivate();
        this.setRenderableFlowState(this.text, 'inactive');
    }
}