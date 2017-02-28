/**
 @author: Tom Clement (tjclement)
 @copyright Bizboard, 2015
 */

import {InputSurface}               from './InputSurface.js';
import {ObjectHelper}               from 'arva-js/utils/ObjectHelper.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {Colors}                     from '../defaults/DefaultColors.js';

export class SingleLineInputSurface extends InputSurface {
    constructor(options = {}) {
        let mergedOptions = combineOptions({
            placeholder: 'Enter comment',
            properties: {
                border: 'none',
                outline: 'none',
                borderRadius: '2px',
                boxShadow: '0px 2px 4px 0px rgba(50, 50, 50, 0.08)',
                padding: '0 16px 0 16px'
            },
            activeColor: null,
            inactiveColor: null,
            clearOnEnter: true,
            enabled: true,
            attributes: {
                type: options.type
            }
        }, options);

        super(mergedOptions);

        this.options = mergedOptions;
        this._cachedValue = null;

        ObjectHelper.bindAllMethods(this, this);

        if (this.options.enabled) {
            this._initListeners();
        } else {
            this._disableListeners();
        }
    }

    _initListeners() {
        this.on('keyup', this._onKeyUp.bind(this));
        this.on('keydown', this._onKeyDown.bind(this));

        this.setProperties({
            color: this.options.activeColor || Colors.Black
        });

        this.removeAttributes(['disabled']);
    }

    _disableListeners(){
        this.removeListener('keyup', this._onKeyUp.bind(this));
        this.removeListener('keydown', this._onKeyDown.bind(this));

        this.setProperties({
            color: this.options.inactiveColor || Colors.Gray
        });

        this.setAttributes({
            disabled: true
        });

    }

    /**
     * Enable or disable the SingleLineInputSurface
     * @param enabled
     */
    enable(enabled = true) {
        return enabled ? this._initListeners() : this._disableListeners();
    }

    _onKeyDown(event) {
        /* We need to defer this method, because this.getValue() is
         * not yet updated with the new value when the 'keydown' event fires. */
        setTimeout(() => {
            let newValue = this.getValue();
            if (this._cachedValue !== newValue) {
                this._cachedValue = newValue;
                this._eventOutput.emit('value', this._cachedValue);
            }
        }, 0);
    }

    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();

            /* Hide keyboard after input */
            if (cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        } else {
            let newValue = this.getValue();
            if (this._cachedValue !== newValue) {
                this._cachedValue = newValue;
                this._eventOutput.emit('value', this._cachedValue);
            }
        }


    }

    _onMessageComplete() {
        let message = this._cachedValue;
        if (message === '') {
            return;
        }

        if (this.options.clearOnEnter) {
            this.setValue('');
            this._cachedValue = '';
        }

        this._eventOutput.emit('message', message);
    }
}
