/**
 * Created by lundfall on 12/07/16.
 */

import {WhiteIconButton}            from './WhiteIconButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {SolidTextButton}    from './SolidTextButton.js';


export class SolidImageButton extends WhiteIconButton {
    constructor(options){
        super(combineOptions(SolidTextButton.generateOptions(options), options));
    }
}