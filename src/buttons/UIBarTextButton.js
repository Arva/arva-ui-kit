/**
 * Created by lundfall on 12/07/16.
 */

import {combineOptions}                 from 'arva-js/utils/CombineOptions.js';
import {TextButton}                     from './TextButton.js';
import {TypeFaces}                      from '../defaults/DefaultTypefaces.js';

export class UIBarTextButton extends TextButton {

    constructor(options = {}) {
        super(combineOptions(
            {properties: options.variation === 'light' ? TypeFaces.UIButtonPrimaryLight : TypeFaces.UIButtonPrimary},
            combineOptions({
            backgroundProperties: {
                backgroundColor: 'none'
            },
            useBoxShadow: false,
            makeRipple: false
        }, options)));
    }
}