/**
 * Created by lundfall on 08/07/16.
 */
import _                    from 'lodash';
import Surface              from 'famous/core/Surface.js';
import Transform            from 'famous/core/Transform';
import AnimationController  from 'famous-flex/AnimationController.js';
import {View}               from 'arva-js/core/View.js';

import {combineOptions}     from 'arva-js/utils/CombineOptions.js';

import insertRule           from 'insert-rule';
import {layout, options}    from 'arva-js/layout/decorators.js';
import Easing                   from 'famous/transitions/Easing.js';

let rippleSize = 400;

export class Ripple extends View {

    @layout.translate(0, 0, 10)
    @layout.animate({
        showInitially: false,
        transition: {duration: 2000, curve: (x) => x},
        /*hide: {animation: function()  {
            return {
                transform: Transform.scale(2, 2, 1),
                align: [0.5, 0.5],
                opacity: 0,
                origin: [0.5, 0.5]
            };
        }},
        show: {animation: function() {
            return {opacity: 1, origin: [0.5, 0.5], align: [0.5, 0.5]}
        }}*/
    })
    @layout.size(rippleSize, rippleSize)
    ripple = new Surface({
        properties: {
            borderRadius: '100%',
            /* Center it aligned to the clipping surface */
            margins: '-12.5% -12.5%',
            backgroundColor: '#333',
            /*boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.65) inset, 0px 0px 5px rgba(255, 255, 255, 0.5)'*/
        }
    });


    show(x, y) {
        let {decorations} = this.ripple;
        /* Shift it because origin/align is 0.5 */
        decorations.translate[0] = x - rippleSize/2;
        decorations.translate[1] = y - rippleSize/2;
        this.layout.reflowLayout();
        this.hideRenderable('ripple');
    }

    hide() {
        this.renderables.ripple.halt();
        this.showRenderable('ripple');
    }

}
