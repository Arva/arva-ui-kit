/**
 * Created by Manuel on 18/08/16.
 */
import AutosizeTextareaSurface      from 'famous-autosizetextarea/AutosizeTextareaSurface.js';

import {View}                       from 'arva-js/core/View.js';
import {flow, layout, event}        from 'arva-js/layout/decorators.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';
import {SingleLineTextInput}        from 'arva-kit/input/SingleLineTextInput.js';

import {Dimensions}                 from '../defaults/DefaultDimensions.js';
let {searchBar: {borderRadius}} = Dimensions;

export class MultiLineTextInput extends SingleLineTextInput {

    @layout.size(undefined, undefined)
    @layout.translate(0, 0, 40)
    @layout.stick.center()
    @event.on('blur', function () {
        this._onBlur();
    })
    @event.on('focus', function () {
        this._onFocus();
    })
    input = new AutosizeTextareaSurface(this.options);

    constructor(options = {}) {
        super(combineOptions({
            initialHeight: 144,
            clearOnEnter: false,
            usesFeedback: false,
            emojiEnabled: true,
            placeholder: 'Place comment',
            type: 'text',
            maxHeight: 150,
            properties: {
                backgroundColor: 'transparent',
                padding: options.usesFeedback ? '16px 48px 16px 16px' : '16px',
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
            if (this._savedHeight !== this.options.maxHeight) {
                this.scrollToTop();
            }
        });

        this.input.on('scrollHeightChanged', (scrollHeight)=> {
            if (scrollHeight < this.options.initialHeight) scrollHeight = this.options.initialHeight;
            this.reflowRecursively();
            this._savedHeight = scrollHeight > this.options.maxHeight ? this.options.maxHeight : scrollHeight;
            if (this._savedHeight === this.options.maxHeight) {
                this.input.setProperties({overflow: 'scroll'});
            } else {
                this.input.setProperties({overflow: 'hidden'});
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

    deploy(target) {
        this._currentTarget = this.input._currentTarget;
        super.deploy(target);
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

    _onFocus() {
        this.setRenderableFlowState('shadow', 'shown');
        this.correct.collapse();
        this.incorrect.collapse();
        this.required.collapse();

        this.focus();
    }

    _onBlur() {
        this.setRenderableFlowState('shadow', 'hidden');
        this.blur();
    }

    blur() {
        return this.input.blur();
    }

    focus() {
        return this.input.focus();
    }
}