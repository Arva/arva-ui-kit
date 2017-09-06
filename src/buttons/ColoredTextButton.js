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
                backgroundColor: options.colorProperties ? options.colorProperties.activeBackgroundColor : Colors.PrimaryUIColor
            },
            properties: options.colorProperties ? {color: options.colorProperties.activeTextColor} : {color: 'white'},
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

    /**
     * @example
     * colorProperties = {
        inActiveTextColor: Colors.DarkGrayColor,
        inActiveBackgroundColor: Colors.LightGrayColor,
        activeTextColor: Colors.PrimaryUIColor,
        activeBackgroundColor: Colors.LightGrayColor,
     * };
     *
     * a = new ColoredTextButton({
        colorProperties,
        enabled: false,
        icon: ScanIcon,
        content: `Get free stuff`
     })
     *
     *
     * @param {object} [options.colorProperties] Object containing the colors of the icon/text/background in active and inactive state
     */
    _setEnabled(enabled) {
        let properties = this.options.colorProperties ? this.options.colorProperties : null;
        super._setEnabled(enabled, true, properties);
    }

}
