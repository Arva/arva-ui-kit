/**
 * Created by lundfall on 07/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import AnimationController  from 'famous-flex/AnimationController.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/decorators.js';
import {Clickable}          from '../components/Clickable.js'
import {Ripple}             from '../components/Ripple.js';


@layout.translate(0, 0, 30)
export class Button extends Clickable {
    @layout.fullscreen
    @layout.translate(0, 0, -10)
    background = new Surface({properties: this.options.backgroundProperties});

    @layout.animate({
        showInitially: false,
        animation: AnimationController.Animation.Fade,
        transition: {duration: 75}
    })
    @layout.fullscreen
    pressedIndication = new Surface({
        properties: {
            /*boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5) inset, 0px 0px 5px rgba(255, 255, 255, 0.5)',*/
            backgroundColor: 'rgba(230, 230, 230, 0.5)',
            borderRadius: this.options.backgroundProperties.borderRadius
        }
    });
    @layout.fullscreen
    @layout.translate(0, 0, 40)
    overlay = new Surface({properties: {cursor: 'pointer', borderRadius: this.options.backgroundProperties.borderRadius}});


    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            indicatePress: true,
            useBoxShadow: true,
            delay: 100,
            backgroundProperties: {
                backgroundColor: 'white',
                borderRadius: '4px'
            }
        }, options));
        if (this.options.makeRipple) {
            this.addRenderable(new Ripple(this.options.rippleOptions), 'ripple',
                layout.size(undefined, undefined),
                layout.clip(undefined, undefined, {borderRadius: this.options.backgroundProperties.borderRadius}));
            /* Detect click on ripple as well, otherwise we'll miss some clicks */
        }


        if (this.options.autoEnable) {
            this.overlay.on('deploy', () => {
                /* Automatically enable button when coming into the view or something */
                if (!this._enabled) {
                    this.enable();
                }
            });
        }

        if (this.options.useBoxShadow) {
            let isHardShadow = this.options.boxShadowType === 'hardShadow';
            this.addRenderable(
                new Surface({
                    properties: {
                        boxShadow: `${isHardShadow ? '0px 2px 0px 0px' : '0px 0px 8px 6px'} rgba(0,0,0,0.12)`,
                        borderRadius: this.options.backgroundProperties.borderRadius
                    }
                }), 'boxshadow', layout.place('bottom'),
                layout.translate(0, 0, -20),
                layout.size(...(isHardShadow ? [undefined, undefined] : [(size) => size - 16, (size) => size - 8] )));
        }

    }

    _handleClick(mouseEvent) {
        super._handleClick(mouseEvent);
        if (this.ripple) {
            this.ripple.show(mouseEvent.offsetX, mouseEvent.offsetY);
        }
    }

    _handleTapStart() {
        if (this.options.indicatePress) {
            this.showRenderable('pressedIndication');
        }
    }

    _setEnabled(enabled) {
        super._setEnabled(enabled);

        this.overlay.setProperties({
            backgroundColor: enabled ? 'none' : 'rgba(255, 255, 255, 0.6)',
            cursor: enabled ? 'pointer' : 'inherit'
        });
    }

    _handleTapEnd() {
        /* Cancelling animation causes ugly hack:
         * The AnimationController doesn't want to abort the animation without first showing the
         * renderable, therefore we must hack the state a bit
         */
        if (this.renderables.pressedIndication.get()) {
            this.renderables.pressedIndication._viewStack[0].state = 1;
        }
        this.hideRenderable('pressedIndication');
    }
}
