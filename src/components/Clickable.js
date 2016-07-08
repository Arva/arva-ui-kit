/**
 * Created by lundfall on 07/07/16.
 */

import _                    from 'lodash';
import Surface              from 'famous/core/Surface.js';
import Transform            from 'famous/core/Transform';
import AnimationController  from 'famous-flex/AnimationController.js';
import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout, options}    from 'arva-js/layout/decorators.js';

@layout.margins([0, 12, 0, 12])
export class Clickable extends View {

    enabled = true;
    alwaysEnabled = false;
    easyPress = true;

    constructor(options = {}) {
        options = combineOptions({
            easyPress: false,
            alwaysEnabled: false,
            autoEnable: true,
            clickEventName: 'buttonClick',
            disabledOptions: {content: options.content, properties: {color: '#aaa'}}
        }, options);
        if (options.enabled === false) {
            /* Merge options in two rounds since there are dependencies within the options */
            options = combineOptions(options.disabledOptions, options);
        } else {
            options.enabled = true;
        }

        super(options);

        this.enabled = options.enabled;
        this.alwaysEnabled = options.alwaysEnabled;
        this.easyPress = options.easyPress;

        this._setupListeners();
    }

    _setupListeners() {
        this.on('touchstart', this._onTapStart);
        this.on('mousedown', this._onTapStart);
        this.on('mouseup', this._onTapEnd);
        this.on('mouseout', this._onTapEnd);
        this.on('click', this._onClick);
    }

    _onTapEnd() {
        this._doTapEnd();
    }

    _doTapEnd() {
        /* To be inherited */
    }

    _onTapStart(mouseEvent) {
        if (this._isEnabled()) {
            this._doTapStart(mouseEvent);
        }
    }

    _doTapStart() {
        if (this.easyPress) {
            this._doClick();
        }
    }

    _onClick() {
        if (!this.easyPress && this._isEnabled()) {
            this._doClick();
        }
    }

    _doClick() {
        let {options} = this;
        this.disable();
        this._eventOutput.emit(options.clickEventName, ...(options.clickEventData || []));

    }

    _isEnabled() {
        return this.enabled || this.alwaysEnabled;
    }

    _setEnabled(enabled) {
        if (!this.alwaysEnabled) {
            this.enabled = enabled;
        }
    }

    enable() {
        this._setEnabled(true);
    }

    disable() {
        this._setEnabled(false);
    }
}
