/**
 * Created by Manuel on 06/09/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {TextButton}         from '../buttons/TextButton.js';
import { layout, bindings,
    event, dynamic }        from 'arva-js/layout/Decorators.js'


@bindings.setup({
    makeRipple: false, useBackground: false, useBoxShadow: false, active: false
})
export class Tab extends TextButton {

    /* If current tab is set to active */
    _active = false;

    /* If current tab is being pressed, either by mouse or tab */
    _hover = true;

    /**
     * Base Tab for the TabBar. Class is meant to be extended
     *
     * @example
     * input = new Tab();
     *
     * @param {Object} [options] Construction options
     * @param {Boolean} [options.makeRipple] Whether the tab should have a ripple
     * @param {Boolean} [options.useBackground] Whether the tab should use a background
     * @param {Boolean} [options.useBoxShadow] Whether the tab should use a boxshadow
     */
    constructor(options) {
        super(options);
        if(this.options.active){
            this._setActive();
        } else {
            this._setInactive();
        }
    }

    _handleTouchMove(touchEvent) {
        if (this._inBounds) {
            this.throttler.add(() => {
                this._inBounds = this._isInBounds(touchEvent, this.overlay);
                if (!this._inBounds) {
                    this._setInactive();
                }
            });
        }
    }



    _handleTapStart(mouseEvent) {
        this._onHover();
        this._setActive();
    }

    _onHover() {
        this._hover = true;
        this._inBounds = true;
        this._eventOutput.emit('hoverOn');
    }

    _onMouseOut(mouseEvent) {
        this._handleTapEnd(mouseEvent);
    }

    _handleTapEnd(mouseEvent) {
        if (mouseEvent.type === 'mouseout') {
            this._hover = false;
        }

        if (this._hover) {
            return this._setActive();
        }

        this._setInactive();
    }

    _setActive() {
        if (this._active) {
            return
        }

        this._active = true;
        this._hover = false;
        this.activate();
    }

    _setInactive() {

        if (!this._active) {
            return;
        }
        this._eventOutput.emit('hoverOff');
        this._active = false;
        this._hover = false;
        this.deactivate();
    }

    /**
     * Set the state of the Tab renderable to active
     * @private
     */
    activate() {
        this._eventOutput.emit('activate');
    }

    /**
     * Set the state of the Tab renderable to inactive
     * @private
     */
    deactivate() {
        /* to be inherented */
    }
}