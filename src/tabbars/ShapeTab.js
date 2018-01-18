/**
 * Created by Manuel on 06/09/16.
 */

import {Surface}                    from 'arva-js/surfaces/Surface.js';
import Easing                       from 'famous/transitions/Easing.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {flow, layout, bindings}     from 'arva-js/layout/Decorators.js';
import {flowStates}                 from 'arva-js/layout/FlowStates.js';
import {Tab}                        from './Tab.js';

@bindings.setup({
    color: 'white'
})
export class ShapeTab extends Tab {

    @bindings.trigger()
    setTextOpacity() {
        this.options.textOpacity = this.options.active ? 1 : 0.6;
    }

}