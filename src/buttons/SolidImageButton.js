/**
 * Created by lundfall on 12/07/16.
 */

import {ImageButton}            from './ImageButton.js';

/**
 * Created by lundfall on 12/07/16.
 */
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {SolidTextButton}    from './SolidTextButton.js';


export class SolidImageButton extends ImageButton {
    constructor(options){
        super(combineOptions(SolidTextButton.generateOptions(options), options));
    }
}