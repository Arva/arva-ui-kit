/**
 * Created by Manuel on 09/09/16.
 */

import Easing               from 'famous/transitions/Easing.js';
import ImageSurface         from 'famous/surfaces/ImageSurface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Button}             from '../../buttons/Button.js';
import {layout, flow}       from 'arva-js/layout/Decorators.js';
import {flowStates}         from 'arva-js/layout/FlowStates.js';

import {AccountIcon}        from '../../icons/AccountIcon.js';

const flowOptions = {transition: {curve: Easing.outCubic, duration: 200}};

export class IconTab extends Button {
    _hover = true;

    /**
     * IconTab that displays an Icon
     * @param {Object} [options] Construction options
     * @param {String} [options.image] The optional image to display
     * @param {Number} [options.icon] The icon's renderable Class, won't be used when an image is defined. Defaults to AccountIcon
     */
    constructor(options = {}) {
        super(combineOptions(options, {
            icon: AccountIcon,
            makeRipple: false,
            useBackground: false,
            useBoxShadow: false
        }));
    }

    @layout.translate(0, 0, 50)
    @layout.size(24, 24)
    @layout.origin(0.5,0.5)
    @layout.align(0.5,0.5)
    @flowStates.fade('inactive', {opacity: 1}, flowOptions)
    @flowStates.fade('active', {opacity: 0.5}, flowOptions)
    icon = this.options.image ? new ImageSurface({content: this.options.image}) : new this.options.icon({color: this.options.properties.color});

    @layout.translate(0, 0, 50)
    @layout.size(24, 24)
    @layout.origin(0.5,0.5)
    @layout.align(0.5,0.5)
    @flowStates.fade('inactive', {opacity: 0.5}, flowOptions)
    @flowStates.fade('active', {opacity: 1}, flowOptions)
    iconOverlay = this.options.image ? new ImageSurface({content: this.options.image}) : new this.options.icon({color: this.options.properties.activeColor || 'black'});

    _active = false;

    getSize(){
        return [24,48]
    }

    _handleTouchMove(touchEvent) {
        if (this._inBounds) {
            this.throttler.add(()=> {
                this._inBounds = this._isInBounds(touchEvent);
                if (!this._inBounds) {
                    this._setDeactive();
                }
            });
        }
    }

    _handleTapStart(mouseEvent) {
        this._hover = true;
        this._inBounds = true;
        this._eventOutput.emit('hoverOn');
        this._activate();

    }

    _handleTapEnd(mouseEvent) {
        if (mouseEvent.type === 'mouseout') {
            this._hover = false;
        }

        if (this._hover) {
            return this._setActive();
        }

        this._setDeactive();
    }

    _setActive() {
        this._active = true;
        this._hover = false;
        this._eventOutput.emit('activate');
        this._deactivate();
    }

    _setDeactive() {
        this._active = false;
        this._hover = false;
        this._eventOutput.emit('hoverOff');
        this._deactivate();
    }

    setActive() {
        this.setRenderableFlowState('iconOverlay', 'active');
    }

    setInactive() {
        this.setRenderableFlowState('iconOverlay', 'inactive');
    }

    _activate() {
        this.setRenderableFlowState('iconOverlay', 'inactive');
        this.setRenderableFlowState('icon', 'active');
    }

    _deactivate() {
        this.setRenderableFlowState('icon', 'inactive');
    }
}