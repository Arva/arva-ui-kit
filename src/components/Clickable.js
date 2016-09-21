/**
 * Created by lundfall on 07/07/16.
 */
import Timer                from 'famous/utilities/Timer.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';


export class Clickable extends View {

    /**
     * General interface for something clickable. Create a renderable inside the view 'overlay' with a high z-index
     * to control tap hold/removals within the view. When subclassing this, you can override the following methods:
     *
     * _handleTouchMove: Called when touch move has happened.
     * _handleClick: When a click has happened, or touchstart if options.easyPress is true. Will not trigger when disabled.
     * _handleMouseOut: Called when mouse out has been triggered.
     * _handleTapStart: Called when tap has started.
     * _handleTapEnd: Called when tap has ended ONLY when tap also started within the same element.
     * _handleTapRemoved: When, this.overlay is specified, then this will happen when tap has been removed while still
     * not yet released.
     *
     *
     * @param {Object} options
     * @param {String}  [options.clickEventName] An event to fire after click has happened.
     * @param {String}  [options.clickEventData] An array of data to fire after click has happened.
     * @param {Boolean} [options.disableAfterClick] If set to true, disables the clickable after it's been clicked.
     * @param {Boolean} [options.enabled] If set to false, the clickable does not trigger clickEventName.
     * @param {Boolean} [options.easyPress] If set to true, triggers a click with the clickEventName, clickEventData,
     * and _handleClick on tap start instead of click
     *
     */
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
        if (this.overlay && !this._isInBounds(event, this.overlay)) {
            this._tapActive = false;
            this._handleTapRemoved();
        }
        this._handleTouchMove(...arguments);
    }

    _onTapEnd(mouseEvent) {
        if(this._tapActive){
            this._eventOutput.emit('tapEnd');
            this._tapActive = false;
            this._handleTapEnd(mouseEvent);
        }
    }

    _onMouseOut(mouseEvent) {
        let overlay = this.overlay;
        if(this._tapActive && (!overlay || mouseEvent.target === overlay._element)){
            this._tapActive = false;
            this._handleTapRemoved(mouseEvent);
        }
        this._handleMouseOut();
    }

    _handleTouchMove(event){
        /* To be inherited */
    }

    _handleTapRemoved(){
        /* To be inherited */
    }

    _handleMouseOut(){
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
        this._tapActive = true;
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
