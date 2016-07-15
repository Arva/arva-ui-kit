/**
 * Created by lundfall on 12/07/16.
 */

import {ImageButton}            from './ImageButton.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {OutlineTextButton}  from './OutlineTextButton.js';

export class OutlineImageButton extends ImageButton {
    constructor(options) {
        super(combineOptions(OutlineTextButton.generateOptions(options), options));
    }
}