/**
 * Created by lundfall on 12/07/16.
 */

import {WhiteIconButton}            from './WhiteIconButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {ColoredTextButton}    from './ColoredTextButton.js';


export class ColoredIconButton extends WhiteIconButton {
    constructor(options){
        super(combineOptions(options.colorProperties ? {
            iconProperties: {color: options.colorProperties.activeIconColor},
            backgroundProperties: {
                backgroundColor: options.colorProperties.activeBackgroundColor
            }
        } : ColoredTextButton.generateOptions(options), options));
    }

    _setEnabled(enabled) {
        let properties = this.options.colorProperties ? this.options.colorProperties : null;
        super._setEnabled(enabled, true, properties);
    }
}