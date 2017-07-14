/**
 * Created by joe on 14/07/17.
 */

import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {UIHeader as face}      from '../defaults/DefaultTypefaces.js';
import {Text}                   from './Text.js';

export class UIHeader extends Text {
    constructor(options) {
        super(combineOptions(face, options));
    }
}