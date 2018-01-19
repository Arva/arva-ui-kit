/**
 * Created by lundfall on 07/07/16.
 */
import Timer from 'famous/utilities/Timer.js';

import {View} from 'arva-js/core/View.js';
import {layout, bindings, event, dynamic} from 'arva-js/layout/Decorators.js'


@bindings.setup({
    enabled: true,
    clickEventName: 'buttonClick',
    easyPress: false,
    disableAfterClick: false,
    clickEventData: []
})
export class Clickable extends View {

    @bindings.trigger()
    ensureClickEventDataIsArray() {
        if(!Array.isArray(this.options.clickEventData)){
            this.options.clickEventData = [this.options.clickEventData];
        }
    }

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
     * @param {Array}   [options.clickEventData] An array of data to fire after click has happened.
     * @param {Boolean} [options.disableAfterClick] If set to true, disables the clickable after it's been clicked.
     * @param {Boolean} [options.enabled] If set to false, the clickable does not trigger clickEventName.
     * @param {Boolean} [options.easyPress] If set to true, triggers a click with the clickEventName, clickEventData,
     * and _handleClick on tap start instead of click
     *
     */
    constructor(options) {
        super(options);
        this._setupListeners();
    }

    enable() {
        this._setEnabled(true);
    }

    disable() {
        this._setEnabled(false);
    }

    /**
     * To be inherited
     * @param {Boolean} isEnabled
     * @private
     */
    _setEnabled(isEnabled){

    }

    setClickEventName(name) {
        if (name) {
            this.options.clickEventName = name;
        }
    }

    getClickEventName(name) {
        if (name) {
            this.options.clickEventName = name;
        }
    }

    _setupListeners() {
        if ('ontouchstart' in document.documentElement) {
            this.on('touchstart', this._onTapStart.bind(this));
            this.on('touchend', this._onTapEnd.bind(this));
            this.on('click', this._onClick.bind(this));
            this.on('touchmove', this._onTouchMove.bind(this));
            this.on('touchleave', this._onTapEnd.bind(this));
        } else {
            this.on('mousedown', this._onTapStart.bind(this));
            this.on('mouseout', this._onMouseOut.bind(this));
            this.on('mouseup', this._onTapEnd.bind(this));
            this.on('click', this._onClick.bind(this));
        }
    }

    _onTouchMove() {
        if (this.overlay && !this._isInBounds(event, this.overlay)) {
            this._tapActive = false;
            this._handleTapRemoved();
        }
        this._handleTouchMove(...arguments);
    }

    _onTapEnd(mouseEvent) {
        if (this._tapActive) {
            this._eventOutput.emit('tapEnd');
            this._tapActive = false;
            this._handleTapEnd(mouseEvent);
        }
    }

    _onMouseOut(mouseEvent) {
        let overlay = this.overlay;
        if (this._tapActive && (!overlay || mouseEvent.target === overlay._element)) {
            this._tapActive = false;
            this._handleTapRemoved(mouseEvent);
        }
        this._handleMouseOut();
    }

    _handleTouchMove(event) {
        /* To be inherited */
    }

    _handleTapRemoved() {
        /* To be inherited */
    }

    _handleMouseOut() {
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
        if (this.options.enabled) {
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
        if (this.options.easyPress && this.options.enabled) {
            this._handleClick();
        }
    }

    _onClick(mouseEvent) {
        if (!this.options.easyPress && this.options.enabled) {
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
        if (options.disableAfterClick) {
            this.disable();
        }
        let emit = () => this._eventOutput.emit(options.clickEventName, ...(options.clickEventData || []));
        if (delay) {
            Timer.setTimeout(emit, delay)
        } else {
            emit();
        }
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
    _isInBounds(touch, element = {}) {
        if (element._currentTarget) {
            let elementPosition = element._currentTarget.getBoundingClientRect();
            let {left, right, top, bottom} = elementPosition;
            if(!touch.touches){
                return true;
            }
            let touchList = touch.touches.length > 0 ? touch.touches : touch.changedTouches;
            let {pageX, pageY} = touchList[0];

            return (pageX > left && pageX < right && pageY > top && pageY < bottom);
        }
        return false;
    };
}
