/**
 * Created by lundfall on 12/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import {layout, options}    from 'arva-js/layout/decorators.js';
import {TextButton}         from './TextButton.js';
import {Colors}             from '../../defaults/DefaultColors.js';


export class OutlineTextButton extends TextButton {
    constructor(options) {
        super(combineOptions({
            backgroundProperties: {backgroundColor: 'none', border: `1px solid ${Colors.PrimaryUIColor}`},
            useBoxShadow: false
        }, options));
    }
}