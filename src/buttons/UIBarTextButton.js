/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {layout}                 from 'arva-js/layout/Decorators.js';
import {TextButton}                 from './TextButton.js';

export class UIBarTextButton extends TextButton {

    constructor(options = {}) {
        super(combineOptions({
            backgroundProperties: {
                backgroundColor: 'none'
            },
            variation: 'noShadow'
        }, options));
    }
}3