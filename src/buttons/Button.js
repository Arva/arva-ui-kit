/**
 * Created by lundfall on 07/07/16.
 */

import Surface              from 'famous/core/Surface.js';
import {combineOptions}     from 'arva-js/utils/CombineOptions.js';
import {layout}             from 'arva-js/layout/Decorators.js';
import {Throttler}          from 'arva-js/utils/Throttler.js';

import {Clickable}          from '../components/Clickable.js'
import {Ripple}             from '../components/Ripple.js';
import {ComponentPadding}   from '../defaults/DefaultDimensions.js';


@layout.dockPadding(0, ComponentPadding, 0, ComponentPadding)
@layout.translate(0, 0, 30)
export class Button extends Clickable {

    _inBounds = true;

    @layout.fullSize()
    @layout.translate(0, 0, 40)
    overlay = new Surface({
        properties: {
            cursor: this.options.enabled ? 'pointer' : 'inherit',
            borderRadius: this.options.backgroundProperties.borderRadius
        }
    });

    constructor(options) {
        super(combineOptions({
            makeRipple: true,
            useBoxShadow: true,
            useBackground: true,
            autoEnable: false,
            delay: 0,
            backgroundProperties: {
                borderRadius: '4px',
                backgroundColor: 'white'
            },
            properties: {}
        }, options));

        this.throttler = new Throttler(3, false, this, true);

        if (this.options.useBackground){
            this.addRenderable(new Surface({properties: this.options.backgroundProperties}), 'background', layout.fullSize(),layout.translate(0, 0, -10));
        }

        if (this.options.makeRipple) {
            this.addRenderable(new Ripple(this.options.rippleOptions), 'ripple',
                layout.size(undefined, undefined),
                layout.clip(undefined, undefined, {borderRadius: this.options.backgroundProperties.borderRadius}));
        }

        if (this.options.autoEnable) {
            this.overlay.on('deploy', () => {
                /* Automatically enable button when coming into the view*/
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
                layout.size(...(isHardShadow ? [undefined, undefined] : [(width) => width - 16, (_, height) => height - 8] )));
        }

    }

    _handleClick(mouseEvent) {

        /* TouchEvents are enabled, don't listen for click events as touchend will already fire resulting in double click events */
        if(mouseEvent.forwardedTouchEvent) return;

        super._handleClick(mouseEvent);

    }

    _handleTapStart({x, y}) {
        if (this.options.makeRipple && this._isEnabled()) {
            this._inBounds = true;
            /**
             * Calculate the correct position of the click inside the current renderable (overlay taken for easy calculation, as it's always fullSize).
             * This will not account for rotation/skew/any other transforms except translates so if the Button class is e.d rotated the ripple will not be placed in the correct location
             * @type {ClientRect}
             */
            let boundingBox = this.overlay._currentTarget.getBoundingClientRect();
            this.ripple.show(x - boundingBox.left, y - boundingBox.top);
        }
    }

    _setEnabled(enabled) {
        super._setEnabled(enabled);
        this.overlay.setProperties({
            cursor: enabled ? 'pointer' : 'inherit'
        });
    }

    _handleTouchMove(touchEvent){
        if (this.options.makeRipple && this._inBounds) {
            this.throttler.add(()=>{
                this._inBounds = this._isInBounds(touchEvent);
                if(!this._inBounds){
                    this.ripple.hide();
                }
            });
        }
    }

    _handleTapEnd(mouseEvent) {
        if (this.options.makeRipple) {
            this.ripple.hide();
        }
        mouseEvent.type === 'touchend' && this._isInBounds(mouseEvent) && this._handleClick(mouseEvent);
    }
    /**
     * @abstract
     */
    setColor() {

    }

    /**
     * Checks if the current TouchEvent is outside the current target element
     * @param touch
     * @param elemposition
     * @param width
     * @param height
     * @returns {boolean}
     * @private
     */
    _isInBounds(touch) {
        let elemposition = this.overlay._currentTarget.getBoundingClientRect();
        let [width, height] = this.overlay.getSize();

        var left = elemposition.left,
            right = left + width,
            top = elemposition.top,
            bottom = top + height,
            touchX = touch.touches[0].pageX,
            touchY = touch.touches[0].pageY;

        return (touchX > left && touchX < right && touchY > top && touchY < bottom);
    };
}
