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

let rippleSize = 10;

export class Ripple extends View {

    /* Because Animationcontrollers have some serious flaws, a major workaround has been made: we call hide to show the
     * ripple and we show and css property display none on hide
     */
    @layout.translate(0, 0, 10)
    @layout.animate({
        show: {animation: function(show, size) {
            return {opacity: 0.5, origin: [0.5, 0.5], align: [0.5, 0.5]}
        }, transition: {duration: 1}},
        hide: {animation: function()  {
            return {
                transform: Transform.scale(15, 15, 1),
                align: [0.5, 0.5],
                opacity: 0,
                origin: [0.5, 0.5]
            }
        },
            transition: {duration: 500, curve: (x) => x}},
    })
    @layout.size(rippleSize, rippleSize)
    ripple = new Surface({
        properties: {
            borderRadius: '100%',
            /* Center it aligned to the clipping surface */
            margins: '-12.5% -12.5%',
            backgroundColor: 'rgba(230, 230, 230, 0.8)',
            display:"none"
            /*boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.65) inset, 0px 0px 5px rgba(255, 255, 255, 0.5)'*/
        }
    });


    show(x, y) {
        let {decorations} = this.ripple;
        /* Shift it because origin/align is 0.5 */
        decorations.translate[0] = x - rippleSize/2;
        decorations.translate[1] = y - rippleSize/2;
        this.layout.reflowLayout();
        this.showRenderable('ripple');
        this.renderables.ripple.hide( null,() => {
            this.ripple.setProperties({display:'none'});
            this.showRenderable('ripple');
        });
        this.ripple.setProperties({display:'inherit'});
    }

}
