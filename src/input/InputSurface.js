/**
 * Created by lundfall on 13/07/16.
 */
import FamousInputSurface           from 'famous/surfaces/InputSurface.js';

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';
/**
 * Emits 'valueChange' when input is changed
 */
export class InputSurface extends FamousInputSurface {
    constructor(options = {}) {
        let properties = {
            outline: 'none',
            borderBottom: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            padding: '0 16px 0 16px'
        };

        if (options.isFormField) {
            Object.assign(properties, {borderBottom: '1px solid gray', boxShadow: '0px 2px 4px 0px rgba(50, 50, 50, 0.08)'});
        }

        super(combineOptions({
            properties
        }, options));
        this.on('paste', this._onFieldChange);
        this.on('input', this._onFieldChange);
        this.on('propertychange', this._onFieldChange);
        this.on('change', this._onFieldChange);
    }

    /**
     * Bugfix 1: Placeholder is wrongly assigned
     * Bugfix 2: value is assigned before type, which can have constraints that causes the browser to reject the change
     * @param target
     */
    deploy(target) {
        target.placeholder = this._placeholder || '';
        target.type = this._type;
        target.value = this._value;
        target.name = this._name;
    }

    setValue(value) {
        if (this.options.isFormField) {
            this._setBorderBottomColor(value);
        }
        return super.setValue(...arguments);
    }

    focus() {
        super.focus();
        this.emit('focus');
    }

    blur() {
        super.blur();
        this.emit('blur');
    }

    _setBorderBottomColor(textInput) {
        this.setProperties({borderBottom: `1px solid ${!textInput.length ? 'gray' : 'black'}`})

    }

    // TODO We should emit a change event instead, and prevent the parent change event. valueChange event is only emitted by SOME input components.
    _onFieldChange() {
        let currentValue = this.getValue();
        if (currentValue != this._value) {
            if(this.options.emojiEnabled) {
                currentValue = replaceEmojiAtEnd(currentValue);
                this.setValue(currentValue);
            }

            this._value = currentValue;
            if (this.options.isFormField) {
                this._setBorderBottomColor(currentValue);
            }
            this.emit('valueChange', currentValue);
        }
    }
}
