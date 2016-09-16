/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Button}             from '../buttons/Button.js';
import {getShadow}          from '../defaults/DefaultShadows.js';

const softShadowBoxMargin = 8;

export class WhiteBox extends Button {

    constructor(options = {}) {
        super(combineOptions({
            enableSoftShadow: false,
            rippleOptions: {sizeMultiplier: 4}
        }, options));

        let borderRadius = this.options.borderRadius;
        this.background.setProperties({borderRadius: borderRadius ? borderRadius : '2px'});
    }

}