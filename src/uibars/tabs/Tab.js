/**
 * Created by Manuel on 06/09/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {TextButton}         from '../../buttons/TextButton.js';

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
    constructor(options = {}){
        super(combineOptions(options, {makeRipple: false, useBackground: false, useBoxShadow: false}));
    }

    _handleTouchMove(touchEvent){
        if (this._inBounds) {
            this.throttler.add(()=>{
                this._inBounds = this._isInBounds(touchEvent);
                if(!this._inBounds){
                    this._setDeactive();
                }
            });
        }
    }

    _handleTapStart(mouseEvent){
        this._hover = true;
        this._inBounds = true;
        this._eventOutput.emit('hoverOn');
        this._activate();

    }
    _onMouseOut(mouseEvent) {
        this._handleTapEnd(mouseEvent);
    }

    _handleTapEnd(mouseEvent) {
        if(mouseEvent.type === 'mouseout'){
            this._hover = false;
        }

        if(this._hover){
           return this._setActive();
        }

        this._setDeactive();
    }

    _setActive(){
        this._active = true;
        this._hover = false;
        this._eventOutput.emit('activate');
        this._deactivate();
    }

    _setDeactive(){
        this._active = false;
        this._hover = false;
        this._eventOutput.emit('hoverOff');
        this._deactivate();
    }

    /**
     * Set the state of the Tab renderable to active
     * @private
     */
    _activate(){
        /* To be inherented */
    }

    /**
     * Set the state of the Tab renderable to inactive
     * @private
     */
    _deactivate(){
        /* to be inherented */
    }
}