/**
 * Created by lundfall on 12/07/16.
 */
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {WhiteTextButton}         from './WhiteTextButton.js';
import {Colors}             from '../defaults/DefaultColors.js';

export class OutlineTextButton extends WhiteTextButton {

    static generateOptions(options = {}){
        return {
            disabledOptions: { properties: { color: Colors.ModestTextColor } },
            backgroundProperties: {backgroundColor: 'none', border: `${options.variation === 'bold' ? '2px' : '1px'} solid ${Colors.PrimaryUIColor}`},
            useBoxShadow: false
        }
    }

    constructor(options) {
        super(combineOptions(OutlineTextButton.generateOptions(options), options));
    }
}