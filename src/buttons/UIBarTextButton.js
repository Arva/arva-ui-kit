/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';

import {WhiteTextButton}                     from './WhiteTextButton.js';
import {Colors}                         from '../defaults/DefaultColors.js';
import {TypeFaces}                      from '../defaults/DefaultTypefaces.js';

export class UIBarTextButton extends WhiteTextButton {

    static getColor(variation = 'white') {
        switch (variation) {
            case 'white':
                return Colors.PrimaryUIColor;
            case 'colored':
                return 'rgb(255, 255, 255)';
            default:
                console.log('Invalid variation selected. Falling back to default settings (white).');
        }
    }

    constructor(options = {}) {
        super(combineOptions(
            { properties: options.variation === 'light' ? TypeFaces.UIButtonPrimaryLight : TypeFaces.UIButtonPrimary },
            combineOptions({
            disabledColor: Colors.Gray,
            useBackground: false,
            useBoxShadow: false,
            makeRipple: false
        }, options)));
    }

    setVariation(variation) {
        let color = this.options.properties.color = UIBarTextButton.getColor(variation);
        this.setColor(this._enabled ? color : this.options.disabledColor);
    }

    _setEnabled(enabled) {
        /* Don't change background if disabled */
        super._setEnabled(enabled, false);
        this.text.setProperties({ color: enabled ? this.options.properties.color : this.options.disabledColor });
    }

}