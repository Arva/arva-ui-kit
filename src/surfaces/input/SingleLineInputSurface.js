/**
 * Created by Manuel on 12/07/16.
 */

import {InputSurface}               from './InputSurface.js';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';


export class SingleLineInputSurface extends InputSurface {
    constructor(options = {}) {
        options = combineOptions({
            placeholder: 'Enter comment',
            clearOnEnter: true
        }, options);
        super(options);
        this.options = options;
        this.on('keyup', this._onKeyUp);
    }

    _onKeyUp(event) {
        let keyCode = event.keyCode;

        if (keyCode === 13) {
            this._onMessageComplete();
        }
    }

    _onMessageComplete() {
        let message = this.getValue();
        if(message === ''){ return; }

        if (this.options.clearOnEnter) {
            this.setValue('');
        }

        this._eventOutput.emit('message', message);
    }
}