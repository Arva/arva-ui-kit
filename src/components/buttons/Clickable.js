/**
 * Created by lundfall on 07/07/16.
 */

import _                    from 'lodash';
import Surface              from 'famous/core/Surface.js';
import Transform            from 'famous/core/Transform';
import AnimationController  from 'famous-flex/AnimationController.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import insertRule           from 'insert-rule';
import {layout, options}    from 'arva-js/layout/decorators.js';



@layout.margins([0, 12, 0, 12])
export class Clickable extends View {
    
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

        /* Center text vertically by setting lineheight (better for performance) */
        this.layout.on('layoutstart', ({size}) => {
            let newLineHeight = `${size[1]}px`;
            let {text} = this;
            if (text.getProperties().lineHeight !== newLineHeight) {
                text.setProperties({lineHeight: newLineHeight});
            }
        });

        this._enabled = options.enabled;
        this._setupListeners();
    }

    _setupListeners() {
        this.on('touchstart', this._onTapStart);
        this.on('mousedown', this._onTapStart);
        this.on('mouseup', this._onTapEnd);
        this.on('mouseout', this._onTapEnd);
        this.on('click', this._onClick);
        if (this.options.autoEnable) {
            this.text.on('deploy', () => {
                /* Automatically enable button when coming into the view or something */
                if (!this._enabled) {
                    this.enable();
                }
            });
        }
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
        if (this.options.easyPress) {
            this._doClick();
        }
    }
    
    _onClick () {
        if (!this.options.easyPress && this._isEnabled()) {
            this._doClick();
        }
    }

    _doClick() {
        let {options} = this;
        this.disable();
        this._eventOutput.emit(options.clickEventName, ...(options.clickEventData || []));

    }

    _isEnabled(){
        return this._enabled || this.options.alwaysEnabled;
    }

    _setEnabled(enabled) {
        if(!this.options.alwaysEnabled){
            this._enabled = enabled;
            let {options} = this;
            this.text.setOptions(enabled ? options : options.disabledOptions);
        }
    }

    enable() {
        this._setEnabled(true);
    }

    disable(){
        this._setEnabled(false);
    }
}
