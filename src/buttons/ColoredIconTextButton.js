/**
 * Created by paulvanmotman on 22/08/2017.
 */

import {combineOptions}             from 'arva-js/utils/CombineOptions.js';

import {WhiteIconTextButton}        from './WhiteIconTextButton.js';
import {Colors}                     from '../defaults/DefaultColors';


export class ColoredIconTextButton extends WhiteIconTextButton {
    constructor(options){
        super(combineOptions({
            textProperties: options.colorProperties ? {color: options.colorProperties.activeTextAndIconColor} : {color: 'white'},
            iconProperties: options.colorProperties ? {color: options.colorProperties.activeTextAndIconColor} : {color: 'white'},
            backgroundProperties: {
                backgroundColor: options.colorProperties ? options.colorProperties.activeBackgroundColor : Colors.PrimaryUIColor
            }
        }, options));
    }
    /**
     * @example
     * colorProperties = {
        inActiveTextAndIconColor: Colors.darkGrayColor,
        inActiveBackgroundColor: Colors.lightGrayColor,
        activeTextAndIconColor: Colors.PrimaryUIColor,
        activeBackgroundColor: Colors.lightGrayColor,
     * };
     *
     * a = new ColoredIconTextButton({
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
