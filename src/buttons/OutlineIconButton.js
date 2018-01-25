/**
 * Created by lundfall on 12/07/16.
 */

import {WhiteIconButton}            from './WhiteIconButton.js';
import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {OutlineTextButton}      from './OutlineTextButton.js';

export class OutlineIconButton extends WhiteIconButton {
    constructor(options) {
        super(combineOptions(OutlineTextButton.generateOptions(options), options));
    }
}