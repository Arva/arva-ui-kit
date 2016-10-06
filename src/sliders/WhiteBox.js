/**
 * Created by vlad on 01/09/16.
 */

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';
import {Button}                     from '../buttons/Button.js';

export class WhiteBox extends Button {

    constructor(options = {}) {
        super(combineOptions({
            enableSoftShadow: false
        }, options));

        let borderRadius = this.options.borderRadius;
        this.background.setProperties({borderRadius: borderRadius ? borderRadius : '2px'});
    }

}