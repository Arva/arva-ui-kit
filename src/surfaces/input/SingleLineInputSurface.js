/**
 * Created by Manuel on 12/07/16.
 */

import InputSurface                 from 'famous/surfaces/InputSurface';
import {combineOptions}             from 'arva-js/utils/CombineOptions.js';


export class SingleLineInputSurface extends InputSurface {
    constructor(options = {}) {
        super(combineOptions({
            placeholder: 'Enter comment',
            properties: {
                border: 'none',
                borderRadius: '2px',
                boxShadow: '0px 2px 4px 0px rgba(50, 50, 50, 0.08)',
                padding: '0 16px 0 16px'
            },
            clearOnEnter: true
        }, options));

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