/**
 * Created by Manuel on 18/08/16.
 */
import Surface                      from 'famous/core/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout}                     from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';

import AutosizeTextareaSurface      from 'famous-autosizetextarea/AutosizeTextareaSurface.js';


export class MultiLineInputView extends View {

    @layout.size(undefined, undefined)
    input = new AutosizeTextareaSurface(combineOptions(this.options, {
        properties: {
            resize: 'none',
            outline: 'none',
            overflow: 'hidden'
        }
    }));

    constructor(options = {}) {
        super(combineOptions({
            initialHeight: 50,
            clearOnEnter: false,
            emojiEnabled: true,
            placeholder: 'Type a message',
            type: 'text', 
            maxHeight: 150,
            properties: {
                padding: '5px 10px 5px 10px'
            }
        }, options));

        /* Set properties specificly as resize property is not set on construction */
        this.input.setProperties({resize: 'none', padding: this.options.properties.padding});
        this.input.on('scroll', () => {
            if(this._savedHeight !== this.options.maxHeight) {
                this.scrollToTop();
            }
        });

        this.input.on('scrollHeightChanged', (scrollHeight)=> {
            if (scrollHeight < this.options.initialHeight) scrollHeight = this.options.initialHeight;
            this.reflowRecursively();
            this._savedHeight = scrollHeight > this.options.maxHeight ? this.options.maxHeight : scrollHeight;
            if(this._savedHeight === this.options.maxHeight){
                this.input.setProperties({ overflow: 'scroll'});
            } else {
                this.input.setProperties({ overflow: 'hidden'});
            }
        });

        this.input.on('keyup', this._onKeyUp);
        this.input.on('paste', this._onFieldChange);
        this.input.on('input', this._onFieldChange);
        this.input.on('propertychange', this._onFieldChange);
    }

    getSize() {
        return [undefined, this._savedHeight || this.options.initialHeight]
    }

    scrollToTop() {
        this.input._element.scrollTop = 0
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

    blur() {
        return this.input.blur();
    }

    focus() {
        return this.input.focus();
    }
}