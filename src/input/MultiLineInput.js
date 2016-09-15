/**
 * Created by Manuel on 18/08/16.
 */
import AutosizeTextareaSurface      from 'famous-autosizetextarea/AutosizeTextareaSurface.js';

import {View}                       from 'arva-js/core/View.js';
import {flow, layout, event}        from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';

import {Dimensions}                 from '../defaults/DefaultDimensions.js';
let {searchBar: {borderRadius}} = Dimensions;

export class MultiLineInput extends View {

    @layout.size(undefined, undefined)
    @layout.translate(0,0,40)
    @layout.stick.center()
    @event.on('blur', function() { this._onBlur(); })
    @event.on('focus', function() { this._onFocus(); })
    input = new AutosizeTextareaSurface(this.options);

    /**
     * A multiline text input field that can contain multiple lines of text.
     *
     * @example
     * @layout.dock.top(~48, 8)
     * input = new MultiLineInput({ placeholder: '' });
     *
     * @param {Object} [options] Construction options
     * @param {Integer} [options.initialHeight] The initial height of the multiline text input
     * @param {Integer} [options.maxHeight] The maximum height of the multiline text input
     * @param {String} [options.content] Prefilled content of the input field
     * @param {String} [options.placeholder] Placeholder text of the input field
     */
    constructor(options = {}) {
        super(combineOptions({
            initialHeight: 144,
            clearOnEnter: false,
            emojiEnabled: true,
            placeholder: 'Enter comment',
            type: 'text',
            maxHeight: 150,
            properties: {
                backgroundColor: 'transparent',
                padding: '16px',
                border: '0px transparent',
                borderRadius: borderRadius,
                boxShadow: 'none',
                resize: 'none',
                outline: 'none',
                overflow: 'hidden'
            }
        }, options));

        /* Set properties specificly as resize property is not set on construction */
        this.input.setProperties(this.options.properties);
        this.input.on('scroll', () => {
            if(this._savedHeight !== this.options.maxHeight && !this._collapsed) {
                this.scrollToTop();
            }
        });

        /* Change the size of the input as the input changes */
        this.input.on('scrollHeightChanged', (scrollHeight)=> {
            if (scrollHeight < this.options.initialHeight) scrollHeight = this.options.initialHeight;
            this.reflowRecursively();
            this._savedHeight = scrollHeight > this.options.maxHeight ? this.options.maxHeight : scrollHeight;
            this.setOverflowProperties();
        });
        this._collapsed = false;
        this.input.on('keyup', this._onKeyUp);
        this.input.on('paste', this._onFieldChange);
        this.input.on('input', this._onFieldChange);
        this.input.on('propertychange', this._onFieldChange);
    }

    collapse() {
        this._collapsed = true;
        this.input.setProperties({ overflow: 'hidden'});
    }

    expand() {
        this.setOverflowProperties();
        this._collapsed = false;
    }

    setOverflowProperties() {
        if(this._savedHeight === this.options.maxHeight){
            this.input.setProperties({ overflow: 'scroll'});
        } else {
            this.input.setProperties({ overflow: 'hidden'});
        }
    }

    getSize() {
        return [undefined, this._savedHeight || this.options.initialHeight]
    }

    scrollToTop() {
        this.input._element.scrollTop = 0
    }

    scrollToBottom() {
        this.input._element.scrollTop = this.input._element.scrollHeight;
    }


    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();
        }
    }

    _onMessageComplete() {
        let message = this.getValue();
        if (!message) return;

        if (this.options.clearOnEnter) {
            this.input.setValue('');
        }

        this._eventOutput.emit('message', message);
    }

    _onFieldChange() {
        let currentValue = this.getValue();
        if (currentValue != this.input._value) {
            if (this.options.emojiEnabled && typeof currentValue === 'string') {
                currentValue = replaceEmojiAtEnd(currentValue);
                this.setValue(currentValue);
            }

            this.input._value = currentValue;
            if (this.options.isFormField) {
                this._setBorderBottomColor(currentValue);
            }
        }
    }

    setValue() {
        this.input.setValue(...arguments);
    }

    getValue() {
        let message = this.input.getValue();
        message = message.trim();
        if (message === '' || message === undefined || message === "\r\n" || message === "\n" || message === "\r") {
            return false;
        }
        return message;
    }

    _onFocus() {
        this.focus();
    }

    _onBlur() {
        this.blur();
    }

    blur() {
        return this.input.blur();
    }

    focus() {
        return this.input.focus();
    }
}