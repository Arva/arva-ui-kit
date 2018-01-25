/**
 @author: Tom Clement (tjclement)
 @copyright Bizboard, 2015
 */

import {InputSurface} from 'arva-js/surfaces/InputSurface.js';
import {Colors} from '../defaults/DefaultColors.js';

export class SingleLineInputSurface extends InputSurface {
    constructor(options = {}) {
        super(options);
        this.on('keyup', this._onKeyUp.bind(this));
    }

    static with(options) {
        let mergedOptions = {
            placeholder: 'Enter comment',
            activeColor: Colors.Black,
            inactiveColor: Colors.Gray,
            clearOnEnter: true,
            enabled: true,
            attributes: {
                type: options.type
            }
            , properties: {
                border: 'none',
                outline: 'none',
                borderRadius: '2px',
                boxShadow: '0px 2px 4px 0px rgba(50, 50, 50, 0.08)',
                padding: '0 16px 0 16px'
                , ...options.properties
            }, ...options
        };
        if(!options.properties || !options.properties.color ){
            mergedOptions.properties.color = mergedOptions[mergedOptions.enabled ? 'activeColor' : 'inactiveColor'];
        }
        let {enabled} = mergedOptions;
        mergedOptions.attributes.disabled = enabled ? undefined : 'disabled';
        mergedOptions.properties.cursor = enabled ? 'text' : 'not-allowed';
        return InputSurface.with(options);
    }



    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();
            /* Hide keyboard after input */
            if (cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        }
    }

    _onMessageComplete() {
        let message = this.getValue();
        if (message === '') {
            return;
        }

        if (this.options.clearOnEnter) {
            this.setValue('');
        }

        this._eventOutput.emit('message', message);
    }
}
