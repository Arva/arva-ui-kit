/**
 * Created by vlad on 09/05/17.
 */

import {combineOptions}         from 'arva-js/utils/CombineOptions.js';
import {UIRegularGray as face}  from '../defaults/DefaultTypefaces.js';
import {Text}                   from './Text.js';

export class UIRegularGray extends Text {
    constructor(options) {
        super(combineOptions(face, options));
    }
}