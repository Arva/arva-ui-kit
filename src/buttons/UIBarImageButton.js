/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                     from 'arva-js/utils/CombineOptions.js';

import {Colors}                             from '../defaults/DefaultColors.js';
import {ImageButton}                        from './ImageButton.js';

export class UIBarImageButton extends ImageButton {

    static getColor(variation = 'white') {
        switch (variation) {
            default:
                console.log('Invalid variation selected. Falling back to default settings (white).');
            case 'white':
                return Colors.PrimaryUIColor;
            case 'colored':
                return 'rgb(255, 255, 255)';
        }
    }

    constructor(options = {}) {
        super(combineOptions({
            backgroundProperties: {
                backgroundColor: 'none'
            },
            variation: 'noShadow',
            makeRipple: false
        }, options));
    }

    setVariation(variation) {
        this.setColor(UIBarImageButton.getColor(variation));
    }

}
