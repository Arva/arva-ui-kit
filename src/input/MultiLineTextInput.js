/**
 * Created by Manuel on 18/08/16.
 */
import Surface                      from 'famous/core/Surface.js';

import {View}                       from 'arva-js/core/View.js';
import {layout}                     from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';


import AutosizeTextareaSurface      from 'famous-autosizetextarea/AutosizeTextareaSurface.js';


export class MultiLineTextInput extends View {

    @layout.size(undefined, undefined)
    input = new AutosizeTextareaSurface(combineOptions(this.options, {
        properties: {
            resize: 'none',
            outline: 'none'
        }
    }));

    constructor(options = {}) {
        super(combineOptions({
            initialHeight: 50, clearOnEnter: true, emojiEnabled: true,
            placeholder: 'Type a message',
            type: 'text', maxHeight: 150
        }, options));

        /* Set properties specifically as resize property is not set on construction */
        this.input.setProperties({resize: 'none', padding: '5px 10px 5px 10px'});

        this.input.on('scrollHeightChanged', (scrollHeight) => {
            if (scrollHeight < this.options.initialHeight) scrollHeight = this.options.initialHeight;
            this._eventOutput.emit('changeInputHeight', scrollHeight > this.options.maxHeight ? this.options.maxHeight : scrollHeight);
        });

        this.input.on('keyup', this._onKeyUp);
        this.input.on('paste', this._onFieldChange);
        this.input.on('input', this._onFieldChange);
        this.input.on('propertychange', this._onFieldChange);

    }

    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();
        }
    }

    _onMessageComplete() {
        let message = this.getValue();
        if(!message) return;

        if (this.options.clearOnEnter) {
            this.input.setValue('');
        }

        this._eventOutput.emit('message', message);
    }

    _onFieldChange() {
        let currentValue = this.getValue();
        if (currentValue != this.input._value) {
            if(this.options.emojiEnabled) {
                currentValue = replaceEmojiAtEnd(currentValue);
                this.setValue(currentValue);
            }

            this.input._value = currentValue;
            if (this.options.isFormField) {
                this._setBorderBottomColor(currentValue);
            }
        }
    }

    setValue(){
        this.input.setValue(...arguments);
    }

    getValue(){
        let message =  this.input.getValue();
        message = message.trim();
        if (message === '' || message === undefined || message === "\r\n" || message === "\n" || message === "\r") {
            return false;
        }
        return message;

    }
}