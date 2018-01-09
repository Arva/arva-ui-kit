/**
 * Created by lundfall on 12/07/16.
 */

import {ImageButton}            from './ImageButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {SolidTextButton}    from './SolidTextButton.js';


export class SolidImageButton extends ImageButton {
    constructor(options){
        super(combineOptions(SolidTextButton.generateOptions(options), options));
    }
}