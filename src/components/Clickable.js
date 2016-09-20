/**
 * Created by lundfall on 07/07/16.
 */
import Timer                from 'famous/utilities/Timer.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';


export class Clickable extends View {

    constructor(options = {}) {
        options = combineOptions({
            easyPress: false,
            disableAfterClick: false,
            enabled: true,
            clickEventName: 'buttonClick'
        }, options);
        super(options);

        if (this.options.enabled === false) {
            /* Merge options in two rounds since there are dependencies within the options */
            this._setEnabled(false);
        }
        this._enabled = options.enabled;
        this._setupListeners();
    }

    enable() {
        this._setEnabled(true);
    }

    disable() {
        this._setEnabled(false);
    }

    _setupListeners() {
        if ('ontouchstart' in document.documentElement) {
            this.on('touchstart', this._onTapStart);
            this.on('touchend', this._onTapEnd);
            this.on('click', this._onClick);
            this.on('touchmove', this._onTouchMove);
            this.on('touchleave', this._onTapEnd);
        } else {
            this.on('mousedown', this._onTapStart);
            this.on('mouseout', this._onMouseOut);
            this.on('mouseup', this._onTapEnd);
            this.on('click', this._onClick);
        }
    }

    _onTouchMove(){
        this._handleTouchMove(...arguments);
    }

    _onTapEnd(mouseEvent) {
        this._tapStarted = false;
        this._handleTapEnd(mouseEvent);
    }

    _onMouseOut(mouseEvent) {
        if(this._tapStarted){
            this._tapStarted = false;
            this._handleTapRemoved(mouseEvent);
        }
    }

    /**
     *
     * @private
     */
    _handleTouchMove(){
        /* To be inherited */
    }

    _handleTapRemoved(){
        /* To be inherited */
    }

    /**
     * Called when the clickable should handle end of a touch or click
     * @param mouseEvent
     * @private
     */
    _handleTapEnd(mouseEvent) {
        /* To be inherited */
    }

    _onTapStart(mouseEvent) {
        this._tapStarted = true;
        if (this._isEnabled()) {
            let args = mouseEvent.touches ? {x: mouseEvent.touches[0].clientX, y: mouseEvent.touches[0].clientY} :
                {x: mouseEvent.clientX, y: mouseEvent.clientY};
            this._handleTapStart(args);
        }
    }

    /**
     * Called when the clickable should handle start of a touch or click
     * @param mouseEvent
     * @private
     */
    _handleTapStart() {
        if (this.options.easyPress && this._isEnabled()) {
            this._handleClick();
        }
    }

    _onClick(mouseEvent) {
        if (!this.options.easyPress && this._isEnabled()) {
            this._handleClick(mouseEvent);
        }
    }

    /**
     * Called when the clickable should handle click
     * @param mouseEvent
     * @private
     */
    _handleClick(mouseEvent) {
        let {options} = this;
        let {delay} = options;
        if(options.disableAfterClick){
            this.disable();
        }
        let emit = () => this._eventOutput.emit(options.clickEventName, ...(options.clickEventData || []));
        if (delay) {
            Timer.setTimeout(emit, delay)
        } else {
            emit();
        }
    }

    _isEnabled() {
        return this._enabled;
    }

    _setEnabled(enabled) {
        this._enabled = enabled;
        this.reflowRecursively();
    }
    

    /**
     * Returns the touch location x and y coordinates relative to the element selected.
     * @param touch
     * @param element
     * @returns {{elementX: Number, elementY: Number}}
     * @private
     */
    _elementRelativeLocation(touch, element) {
        let elementPosition = element._currentTarget.getBoundingClientRect();
        let {left, top} = elementPosition;

        let touchList = touch.touches.length > 0 ? touch.touches : touch.changedTouches;
        let {pageX, pageY} = touchList[0];

        return {elementX: pageX - left, elementY: pageY - top};
    }


    /**
     * Checks if the current TouchEvent is outside the current target element
     * @param touch
     * @param element
     * @returns {boolean}
     * @private
     */
    _isInBounds(touch, element) {
        let elementPosition = element._currentTarget.getBoundingClientRect();
        let {left, right, top, bottom} = elementPosition;

        let touchList = touch.touches.length > 0 ? touch.touches : touch.changedTouches;
        let {pageX, pageY} = touchList[0];

        return (pageX > left && pageX < right && pageY > top && pageY < bottom);
    };
}
