/**
 * Created by lundfall on 13/07/16.
 */
import FamousInputSurface           from 'famous/surfaces/InputSurface.js';

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {replaceEmojiAtEnd}          from './Emoji.js';
import bowser                       from 'bowser';

/**
 * Emits 'valueChange' when input is changed
 */
export class InputSurface extends FamousInputSurface {
    static tabIndex = 1;

    constructor(options = {}) {
        /* type = 'date' is not supported for IE11 */
        if(options.type === 'date' && bowser.msie && bowser.version <= 11 ){
            options.type = 'text';
            options.placeholder = 'mm/dd/yy';
            if(options.attributes.type){
                options.attributes.type = 'text';
            }
        }
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
            properties,
            attributes: {
                tabIndex: InputSurface.tabIndex++
            }
        }, options));
        this.on('paste', this._onFieldChange.bind(this));
        this.on('input', this._onFieldChange.bind(this));
        this.on('propertychange', this._onFieldChange.bind(this));
        this.on('change', this._onFieldChange.bind(this));
    }

    setValue(value, emitEvent = false) {

        if (this.options.isFormField) {
            this._setBorderBottomColor(value);
        }
        let result =  super.setValue(...arguments);
        if(emitEvent){
            this._onNewValue(value);
        }
        return result;
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
            this._onNewValue(currentValue);
        }
    }

    _onNewValue(currentValue) {
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
