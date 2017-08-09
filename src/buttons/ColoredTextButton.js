/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteTextButton}         from './WhiteTextButton.js';
import {Colors}             from '../defaults/DefaultColors.js';

export class ColoredTextButton extends WhiteTextButton {

    static generateOptions(options = {}) {
        return {
            backgroundProperties: {
                backgroundColor: Colors.PrimaryUIColor
            },
            properties: {
                color: 'white'
            },
            ...WhiteTextButton.generateBoxShadowVariations(options.variation)
        }
    }

    constructor(options) {
        super(combineOptions(
            ColoredTextButton.generateOptions(options)
            , options));
    }

    setBackgroundColor(color) {
        this.background && this.background.setProperties({backgroundColor: color});
    }

}
