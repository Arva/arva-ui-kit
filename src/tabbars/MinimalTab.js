/**
 * Created by Manuel on 06/09/16.
 */

import Surface              from 'arva-js/famous/core/Surface.js';
import Easing               from 'arva-js/famous/transitions/Easing.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {flow, layout}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';
import {Tab}                from './Tab.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class MinimalTab extends Tab{

    @layout.translate(0, 0, 30)
    @layout.dock.top()
    @layout.size(~300, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    @layout.opacity(0.7)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    @flowStates.fade('inactive', {opacity: 0.7}, flowOptions)
    text = new Surface(this.options);

    @layout.translate(0, 15, 40)
    @layout.size(~300, undefined)
    @layout.origin(0.5, 0)
    @layout.align(0.5, 0)
    @layout.opacity(0)
    @flow.defaultOptions(flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    @flowStates.fade('inactive', {opacity: 0}, flowOptions)
    textOverlay = new Surface(combineOptions(this.options,{properties: {color: this.options.activeColor}}));

    constructor(options = {}){
        super(combineOptions(options,{
            properties: {
                color: options.inActiveColor
            }
        }));
    }

    setActive(){
        this.setRenderableFlowState('textOverlay', 'active');
    }

    setInactive(){
        this.setRenderableFlowState('textOverlay', 'inactive');
    }

    _activate(){
        this.setRenderableFlowState('textOverlay', 'inactive');
        this.setRenderableFlowState('text', 'active');
    }

    _deactivate(){
        this.setRenderableFlowState('text', 'inactive');
    }
}