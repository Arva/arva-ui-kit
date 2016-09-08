/**
 * Created by Manuel on 06/09/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {TextButton}         from '../../buttons/TextButton.js';
import {layout}             from 'arva-js/layout/Decorators.js';

export class Tab extends TextButton{

    _active = false;
    _hover = true;

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