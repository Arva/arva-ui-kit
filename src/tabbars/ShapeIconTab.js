/**
 * Created by Manuel on 09/09/16.
 */

import Easing               from 'famous/transitions/Easing.js';
import ImageSurface         from 'famous/surfaces/ImageSurface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';

import {IconTab}            from './IconTab.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class ShapeIconTab extends IconTab {

    constructor(options = {}) {
        super(combineOptions(options, {

        }));
    }

    @layout.translate(0, 0, 60)
    @layout.size(24, 24)
    @layout.stick.center()
    @layout.opacity(0)
    @flowStates.fade('inactive', {opacity: 0}, flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    iconOverlay = this.options.image ? new ImageSurface({ content: this.options.image }) : new this.options.icon({color: this.options.properties.activeColor || 'white'});

    @layout.translate(0, 0, 50)
    @layout.size(24, 24)
    @layout.stick.center()
    @flow.stateStep('inactive',flowOptions, layout.opacity(1))
    @flow.stateStep('active',flowOptions, layout.opacity(0.7))
    icon = this.options.image ? new ImageSurface({ content: this.options.image }) : new this.options.icon({color: this.options.properties.color});


    setActive() {
        this.setRenderableFlowState('iconOverlay', 'active');
    }

    setInactive() {
        this.setRenderableFlowState('iconOverlay', 'inactive');
    }


    _activate() {
        this.setRenderableFlowState('icon', 'active');
    }

    _deactivate() {
        this.setRenderableFlowState('icon', 'inactive');
    }
}