/**
 * Created by lundfall on 08/07/16.
 */
import {Surface}        from 'arva-js/surfaces/Surface.js';
import Transform            from 'famous/core/Transform';
import Easing               from 'famous/transitions/Easing.js';

import {View}               from 'arva-js/core/View.js';
import {layout}             from 'arva-js/layout/Decorators.js';

export class Ripple extends View {

    @layout
      .translate(0, 0, 10)
      .animate({
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
      .size(function() {return this._rippleSize}, function() {return this._rippleSize})
    ripple = Surface.with({
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
        this.onNewSize(([width, height]) => {
            let sizeMultiplier = this.options.sizeMultiplier || 2;
            this._rippleSize = sizeMultiplier*Math.sqrt((width*width)+(height*height));
            this._actualRipple = this.getActualRenderable(this.ripple);
            this._actualRipple.setOptions({show: {transition: {duration:0.5*this._rippleSize}}});
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

            this._actualRipple.show(this.ripple, null, () => {
                resolve();
            });
        });
    }

    hide() {
        if (this.isRenderableShowing(this.ripple)) {
            this.getActualRenderable(this.ripple)._viewStack[0].state = 1;
        }
        this.hideRenderable(this.ripple);
    }


}
