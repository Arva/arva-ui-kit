/**
 * Created by lundfall on 08/07/16.
 */
import Surface              from 'famous/core/Surface.js';
import Transform            from 'famous/core/Transform';
import Easing               from 'famous/transitions/Easing.js';

import {View}               from 'arva-js/core/View.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {limit}              from 'arva-js/utils/Limiter.js';

export class Ripple extends View {

    @layout.translate(0, 0, 10)
    @layout.animate({
        showInitially: false,
        show: {
            transition: {duration: 10000, curve: Easing.inSine}
        },
        animation: function () {
            return {
                transform: Transform.scale(0.05, 0.05, 1),
                align: [0.5, 0.5],
                origin: [0.5, 0.5]
            }
        },
        hide: {
            transition: {duration: 100},
            animation: function () {
                return {
                    opacity: 0
                }
            }
        }
    })
    @layout.size(function() {return this._rippleSize}, function() {return this._rippleSize})
    ripple = new Surface({
        properties: {
            borderRadius: '100%',
            /* Center it aligned to the clipping surface */
            margins: '-12.5% -12.5%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
            /*boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.65) inset, 0px 0px 5px rgba(255, 255, 255, 0.5)'*/
        }
    });

    constructor(options) {
        super(options);
        this.layout.once('layoutstart', ({size: [width, height]}) => {
            this._rippleSize = 2*Math.sqrt((width*width)+(height*height));
            this.renderables.ripple.setOptions({show: {transition: {duration:0.5*this._rippleSize}}});
        });
    }


    /**
     * Shows the ripple
     * @param {Number} x The x position of the ripple
     * @param {Number} y The y position of the ripple
     * @returns {Promise} a promise that resolves when the ripple is fully shown
     */
    show(x, y) {
        return new Promise((resolve) => {
            let {decorations} = this.ripple;
            let rippleSize = this._rippleSize;

            /* Shift it because origin/align is 0.5 */
            decorations.translate[0] = x - rippleSize / 2;
            decorations.translate[1] = y - rippleSize / 2;
            this.layout.reflowLayout();

            this.renderables.ripple.show(this.ripple, null, () => {
                resolve();
            });
        });
    }

    hide() {
        if (this.renderables.ripple.get()) {
            this.renderables.ripple._viewStack[0].state = 1;
        }
        this.hideRenderable('ripple');
    }


}
