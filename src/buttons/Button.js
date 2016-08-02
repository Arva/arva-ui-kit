/**
 * Created by lundfall on 07/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import AnimationController  from 'famous-flex/AnimationController.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {Clickable}          from '../components/Clickable.js'
import {Ripple}             from '../components/Ripple.js';
import {ComponentPadding}   from '../defaults/DefaultDimensions.js';


@layout.dockPadding(0, ComponentPadding, 0, ComponentPadding)
@layout.translate(0, 0, 30)
export class Button extends Clickable {
    @layout.fullSize()
    @layout.translate(0, 0, -10)
    background = new Surface({properties: this.options.backgroundProperties});

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface({properties: {cursor: 'pointer', borderRadius: this.options.backgroundProperties.borderRadius}});


    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            useBoxShadow: true,
            delay: 100,
            backgroundProperties: {
                borderRadius: '4px',
                backgroundColor: 'white'
            },
            properties: {}
        }, options));
        if (this.options.makeRipple) {
            this.addRenderable(new Ripple(this.options.rippleOptions), 'ripple',
                layout.size(undefined, undefined),
                layout.clip(undefined, undefined, {borderRadius: this.options.backgroundProperties.borderRadius}));
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
                        boxShadow: `${isHardShadow ? '0px 2px 0px 0px' : '0px 0px 12px 0px'} rgba(0,0,0,0.12)`,
                        borderRadius: this.options.backgroundProperties.borderRadius
                    }
                }), 'boxshadow', layout.stick.bottom(),
                layout.translate(0, 0, -20),
                layout.size(...(isHardShadow ? [undefined, undefined] : [(width) => width - 16, (_,height) => height - 8] )));
        }

    }

    _handleClick(mouseEvent) {
        super._handleClick(mouseEvent);

    }

    _handleTapStart({x, y}) {
        if (this.options.makeRipple && this._isEnabled()) {
            this.ripple.show(x, y);
        }
    }

    _setEnabled(enabled) {
        super._setEnabled(enabled);
        this.overlay.setProperties({
            backgroundColor: enabled ? 'inherit' : 'rgba(255, 255, 255, 0.6)',
            cursor: enabled ? 'pointer' : 'inherit'
        });
    }

    _handleTapEnd() {
        if (this.options.makeRipple) {
            this.ripple.hide();
        }
    }
}
