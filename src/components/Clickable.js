/**
 * Created by lundfall on 07/07/16.
 */
import Timer                from 'famous/utilities/Timer.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';


@layout.margins([0, 12, 0, 12])
export class Clickable extends View {

    constructor(options = {}) {
        options = combineOptions({
            easyPress: false,
            disableAfterClick: false,
            autoEnable: true,
            clickEventName: 'buttonClick'
        }, options);
        if (options.enabled === false) {
            /* Merge options in two rounds since there are dependencies within the options */
            options = combineOptions(options.disabledOptions, options);
        } else {
            options.enabled = true;
        }

        super(options);
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
        this.on('touchstart', this._onTapStart);
        this.on('mousedown', this._onTapStart);
        this.on('touchend', this._onTapEnd);
        this.on('mouseup', this._onTapEnd);
        this.on('touchmove', this._onTapEnd);
        this.on('mouseout', this._onTapEnd);
        this.on('click', this._onClick);

    }

    _onTapEnd(mouseEvent) {
        this._handleTapEnd(mouseEvent);
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
        if (this._isEnabled()) {
            this._handleTapStart(mouseEvent);
        }
    }

    /**
     * Called when the clickable should handle start of a touch or click
     * @param mouseEvent
     * @private
     */
    _handleTapStart() {
        if (this.options.easyPress) {
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
        return this._enabled || !this.options.disableAfterClick;
    }

    _setEnabled(enabled) {
        this._enabled = enabled;
    }
}
