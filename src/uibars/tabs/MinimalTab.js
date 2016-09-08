/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'famous/core/Surface.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}             from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Tab}                from './Tab.js';

export class MinimalTab extends Tab{

    @layout.translate(0, 0, 30)
    @layout.size(~300, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    @layout.opacity(0.7)
    @flowStates.fade('active', {opacity: 1})
    @flowStates.fade('inactive', {opacity: 0.7})
    text = new Surface(this.options);

    constructor(options = {}){
        super(combineOptions(options,{
            color: options.inActiveColor
        }));
    }

    setActive(){
        this.text.setProperties({
            color: this.options.activeColor
        })
    }

    setInactive(){
        this.text.setProperties({
            color: this.options.inActiveColor
        });
    }

    _activate(){
        this.setRenderableFlowState('text', 'active');
    }

    _deactivate(){
        this.setRenderableFlowState('text', 'inactive');
    }
}