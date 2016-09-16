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

    @layout.size((width) => width - softShadowBoxMargin * 2, (_,height) => height - softShadowBoxMargin)
    @layout.stick.bottom()
    @layout.translate(0, 0, -20)
    softShadowBox = new Surface({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: getShadow()
        }
    });

    constructor(options = {}) {
        super(combineOptions({
            enableSoftShadow: false
        }, options));

        let borderRadius = this.options.borderRadius;
        this.background.setProperties({borderRadius: borderRadius ? borderRadius : '2px'});
        this.softShadowBox.setProperties({display: this.options.enableSoftShadow ? 'block' : 'none'});
    }

}