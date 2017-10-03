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

    setNewOptions(options) {
        super.setNewOptions(options);
        if(options.active){
            this._setActive();
        } else {
            this._setInactive();
        }
    }

    _handleTapStart(mouseEvent) {
        this._onHover();
    }

    _onHover() {
        this._hover = true;
        this._inBounds = true;
        this._eventOutput.emit('hoverOn');
    }


    _handleTapEnd(mouseEvent) {


        this._eventOutput.emit('hoverOff');

        if (this._hover) {
            return this._setActive();
        }

        this._setInactive();
    }


    _setActive() {

        if (this.options.active) {
            return
        }

        this.options.active = true;
        this._hover = false;
        this.activate();
    }

    _setInactive() {

        if (!this.options.active) {
            return;
        }

        this.options.active = false;
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