/**
 * Created by lundfall on 13/07/16.
 */
import FamousInputSurface           from 'famous/surfaces/InputSurface';

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

export class InputSurface extends FamousInputSurface {
    constructor(options){
        super(options);
        this.on('paste', this._onFieldChange);
        this.on('input', this._onFieldChange);
        this.on('propertychange', this._onFieldChange);
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


    _onFieldChange() {
        let currentValue = this.getValue();
        if (currentValue != this._value) {
            this._value = currentValue;
            this.emit('valueChange', currentValue);
        }
    }
}
