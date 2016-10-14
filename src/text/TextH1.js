/**
 * Created by tom on 22/08/16.
 */

import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {TextH1 as face}         from '../defaults/DefaultTypefaces.js';
import {Text}                   from './Text.js';

export class TextH1 extends Text {
    constructor(options) {
        super(combineOptions(face, options));
    }
}