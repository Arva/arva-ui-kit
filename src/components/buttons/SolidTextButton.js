/**
 * Created by lundfall on 12/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {TextButton}         from './TextButton.js';
import {Colors}             from '../../defaults/DefaultColors.js';

export class SolidTextButton extends TextButton {
    
    static generateOptions(options){
        return {
            backgroundProperties: {
                backgroundColor: Colors.PrimaryUIColor
            },
            properties: {
                color: 'white'
            },
            ...TextButton.generateBoxShadowVariations(options.variation)
        }
    }
    
    constructor(options) {
        super(combineOptions(
            SolidTextButton.generateOptions(options)
        , options));
        console.log(options);
        console.log(this.options);

    }
}
