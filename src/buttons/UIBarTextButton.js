/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';

import {TextButton}                     from './TextButton.js';
import {Colors}                         from '../defaults/DefaultColors.js';
import {TypeFaces}                      from '../defaults/DefaultTypefaces.js';

export class UIBarTextButton extends TextButton {

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
        super(combineOptions(
            {properties: options.variation === 'light' ? TypeFaces.UIButtonPrimaryLight : TypeFaces.UIButtonPrimary},
            combineOptions({
            backgroundProperties: {
                backgroundColor: 'none'
            },
            useBoxShadow: false,
            makeRipple: false
        }, options)));
    }

    setVariation(variation) {
        this.setColor(UIBarTextButton.getColor(variation));
    }

}