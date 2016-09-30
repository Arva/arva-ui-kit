/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import {ImageButton}                        from './ImageButton.js';

export class UIBarImageButton extends ImageButton {
    constructor(options = {}) {
        super(combineOptions({
            backgroundProperties: {
                backgroundColor: 'none'
            },
            variation: 'noShadow',
            makeRipple: false
        }, options));
    }
}
