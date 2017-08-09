/**
 * Created by lundfall on 12/07/16.
 */

import {WhiteIconButton}            from './WhiteIconButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {ColoredTextButton}    from './ColoredTextButton.js';


export class ColoredIconButton extends WhiteIconButton {
    constructor(options){
        super(combineOptions(ColoredTextButton.generateOptions(options), options));
    }
}