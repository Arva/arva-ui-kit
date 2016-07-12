/**
 * Created by lundfall on 07/07/16.
 */

import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';


@layout.margins([0, 12, 0, 12])
export class Clickable extends View {

    constructor(options = {}) {
        options = combineOptions({
            easyPress: false,
            alwaysEnabled: false,
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
            console.log(`mouseEvent: ${mouseEvent}`);
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
        if(!options.alwaysEnabled){
            this.disable();
        }
        this._eventOutput.emit(options.clickEventName, ...(options.clickEventData || []));
    }

    _isEnabled() {
        return this._enabled || this.options.alwaysEnabled;
    }

    _setEnabled(enabled) {
        this._enabled = enabled;
    }
}
