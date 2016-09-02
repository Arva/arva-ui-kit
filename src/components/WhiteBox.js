/**
 * Created by vlad on 01/09/16.
 */

import Surface              from 'famous/core/Surface.js';
import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {Button}             from '../buttons/Button.js';

const softShadowBoxMargin = 8;

export class WhiteBox extends Button {

    // @layout.fullSize()
    // @layout.translate(0, 0, 10)
    // background = new Surface({
    //     properties: {
    //         backgroundColor: 'rgb(255, 255, 255)'
    //     }
    // });

    @layout.size((width) => width - softShadowBoxMargin * 2, (_,height) => height - softShadowBoxMargin)
    @layout.stick.bottom()
    @layout.translate(0, 0, -20)
    softShadowBox = new Surface({
        properties: {
            borderRadius: '2px',
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.12)'
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